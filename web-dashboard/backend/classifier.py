import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import logging

class Classifier:
    def __init__(self, model_path: str, num_classes: int = 4):
        """
        Initializes the ResNet50 classifier.

        Args:
            model_path (str): Path to the classifier model file (e.g., 'classifier_best.pt').
            num_classes (int): The number of output classes.
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load pre-trained ResNet50 and modify the final layer
        self.model = models.resnet50(weights=None) # No pretrained weights needed as we load our own
        num_ftrs = self.model.fc.in_features
        self.model.fc = nn.Sequential(
            nn.Linear(num_ftrs, 256),
            nn.ReLU(),
            nn.Dropout(p=0.3),
            nn.Linear(256, num_classes)
        )
        
        # Load the trained model state
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.to(self.device)
        self.model.eval() # Set to evaluation mode
        
        self.class_names = ["Josapine", "MD2", "Moris", "Yankee"]
        
        # Define image transformations
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        logging.info(f"ResNet50 classifier loaded from {model_path}. Device: {self.device}")

    def predict(self, image: Image.Image):
        """
        Runs cultivar classification on the input image.

        Args:
            image (Image.Image): The input image (cropped pineapple) in PIL format.

        Returns:
            tuple: A tuple containing the predicted cultivar name (str) and the
                   confidence score (float).
        """
        logging.info("Running ResNet50 cultivar classification...")
        
        # Apply transformations and add batch dimension
        img_t = self.transform(image)
        batch_t = torch.unsqueeze(img_t, 0).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(batch_t)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_idx = torch.max(probabilities, 1)

        cultivar = self.class_names[predicted_idx.item()]
        confidence_score = confidence.item()
        
        logging.info(f"Predicted cultivar: {cultivar} with confidence {confidence_score:.2f}")
        
        return cultivar, confidence_score
