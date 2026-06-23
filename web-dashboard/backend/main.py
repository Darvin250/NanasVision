import logging
import io
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel
import numpy as np

from detector import Detector
from classifier import Classifier

# --- Basic Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Model Paths ---
# Ensure these paths are correct for your project structure
YOLO_MODEL_PATH = "models/yolov8n.pt"

# --- Model Registry ---
# Define all your available classifier models here.
# The class names MUST match the training order for each specific model.
MODEL_REGISTRY = {
    "mobilenet_v3_small_no_aug": {
        "path": "models/mobileNetV3_no_aug.pt",
        "class_names": ["Josapine", "MD2", "Moris", "Yankee"],
        "architecture": "mobilenet_v3_small"
    },
    "mobilenet_v3_small_with_aug": {
        "path": "models/mobileNetV3_aug.pt",
        "class_names": ["Josapine", "MD2", "Moris", "Yankee"],
        "architecture": "mobilenet_v3_small"
    },
    "efficientnet_b0_no_aug": {
        "path": "models/efficientNet_no_aug.pt",
        "class_names": ["Josapine", "MD2", "Moris", "Yankee"],
        "architecture": "efficientnet_b0"
    },
    "efficientnet_b0_with_aug": {
        "path": "models/efficientNet_aug.pt",
        "class_names": ["Josapine", "MD2", "Moris", "Yankee"],
        "architecture": "efficientnet_b0"
    },
    "resnet50_no_aug": {
        "path": "models/resNet50_no_aug.pt",
        "class_names": ["Josapine", "MD2", "Moris", "Yankee"],
        "architecture": "resnet50"
    },
    "resnet50_with_aug": {
        "path": "models/resNet50_aug.pt",
        "class_names": ["Josapine", "MD2", "Moris", "Yankee"],
        "architecture": "resnet50"
    },
}

ACTIVE_CLASSIFIER = "efficientnet_b0_no_aug" # <-- CHANGE THIS LINE TO SWITCH MODELS

# --- Response Models ---
class PredictionResponse(BaseModel):
    status: str
    cultivar: Optional[str] = None
    confidence: Optional[float] = None
    bbox: Optional[List[int]] = None
    message: str

# --- ML Model Singleton ---
# A dictionary to hold our models during the app's lifespan
ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    logging.info("Application startup: Loading ML models...")
    try:
        active_model_config = MODEL_REGISTRY[ACTIVE_CLASSIFIER]
        logging.info(f"Loading active classifier: {ACTIVE_CLASSIFIER}")
        ml_models["detector"] = Detector(YOLO_MODEL_PATH)
        ml_models["classifier"] = Classifier(model_path=active_model_config["path"], 
                                             class_names=active_model_config["class_names"],
                                             architecture=active_model_config["architecture"])
        logging.info("ML models loaded successfully.")
    except Exception as e:
        logging.error(f"Failed to load models on startup: {e}")
        # Depending on the desired behavior, you might want to exit the app
        # raise RuntimeError("Could not initialize ML models.") from e
    
    yield
    
    # --- Shutdown ---
    logging.info("Application shutdown: Clearing ML models...")
    ml_models.clear()

# --- FastAPI App Initialization ---
app = FastAPI(lifespan=lifespan)

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local WiFi testing
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- API Endpoints ---

@app.get("/health")
async def health_check():
    """Health check endpoint to confirm the server is running."""
    return {"status": "ok"}

@app.get("/warmup")
async def warmup_models():
    """Endpoint to pre-warm both models with a dummy image."""
    if "detector" not in ml_models or "classifier" not in ml_models:
        raise HTTPException(status_code=503, detail="Models are not loaded yet.")
        
    logging.info("Warming up models...")
    try:
        # Create a dummy black image (224x224)
        dummy_image_data = np.zeros((224, 224, 3), dtype=np.uint8)
        dummy_image = Image.fromarray(dummy_image_data)
        
        # Warm up detector
        _ = ml_models["detector"].predict(dummy_image)
        
        # Warm up classifier
        _ = ml_models["classifier"].predict(dummy_image)
        
        logging.info("Models warmed up successfully.")
        return {"status": "success", "message": "Models are warmed up."}
    except Exception as e:
        logging.error(f"Error during model warmup: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during warmup: {e}")


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Receives an image, runs the full detection and classification pipeline.
    """
    if "detector" not in ml_models or "classifier" not in ml_models:
         raise HTTPException(status_code=503, detail="Models are not available or still loading.")

    logging.info("Received request for /predict endpoint.")
    
    # --- Read and Validate Image ---
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        logging.error(f"Failed to read or open image: {e}")
        raise HTTPException(status_code=400, detail="Invalid image file.")
    
    # --- Stage 1: Pineapple Detection ---
    bbox = ml_models["detector"].predict(image)
    
    if bbox is None:
        logging.warning("No pineapple detected in the image.")
        return PredictionResponse(
            status="error",
            message="No pineapple detected. Please retake the photo."
        )
        
    # --- Stage 2: Cultivar Classification ---
    # As requested, sending the original image to the classifier, not the cropped one.
    # YOLO is only used to confirm the presence of a pineapple.
    logging.info("Skipping crop step. Sending original image to classifier.")
    cultivar, confidence = ml_models["classifier"].predict(image)
    
    confidence = round(confidence, 2)

    # --- Prepare Response ---
    if confidence < 0.70:
        logging.warning(f"Low confidence classification: {cultivar} ({confidence})")
        return PredictionResponse(
            status="warning",
            cultivar=cultivar,
            confidence=confidence,
            message="Low confidence. Please retake the photo for better results."
        )
    
    logging.info(f"Successfully classified: {cultivar} ({confidence})")
    return PredictionResponse(
        status="success",
        cultivar=cultivar,
        confidence=confidence,
        bbox=bbox,
        message="Classification successful."
    )

if __name__ == "__main__":
    import uvicorn
    # To run this app: uvicorn main:app --reload --host 0.0.0.0 --port 8000
    # The host 0.0.0.0 makes it accessible on your local network
    uvicorn.run(app, host="0.0.0.0", port=8000)
