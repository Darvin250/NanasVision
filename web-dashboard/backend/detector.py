from ultralytics import YOLO
from PIL import Image
import logging
from typing import List, Optional

class Detector:
    def __init__(self, model_path: str):
        """
        Initializes the YOLOv8 detector.
        
        Args:
            model_path (str): Path to the YOLOv8 model file (e.g., 'yolo_best.pt').
        """
        self.model = YOLO(model_path)
        logging.info(f"YOLOv8 model loaded from {model_path}")

    def predict(self, image: Image.Image) -> Optional[List[int]]:
        """
        Runs pineapple detection on the input image.

        Args:
            image (Image.Image): The input image in PIL format.

        Returns:
            Optional[List[int]]: Bounding box coordinates [x1, y1, x2, y2] if a pineapple
                                 is detected, otherwise returns None.
        """
        logging.info("Running YOLOv8 pineapple detection...")
        
        results = self.model(image, conf=0.5, verbose=False)

        # Results are a list, but we process one image at a time.
        # The boxes are already sorted by confidence.
        if results and len(results[0].boxes) > 0:
            best_box = results[0].boxes[0]  # The first box has the highest confidence
            bbox = best_box.xyxy[0].cpu().numpy().astype(int).tolist()
            logging.info(f"Pineapple detected with confidence {best_box.conf[0]:.2f} at {bbox}")
            return bbox
        
        logging.warning("No pineapple detected with confidence > 0.5.")
        return None
