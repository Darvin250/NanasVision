import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import logging

class Classifier:
    def __init__(self, model_path: str, class_names: list, architecture: str, num_classes: int = 4):
        """
        Initializes the image classifier.

        Args:
            model_path (str): Path to the classifier model file (e.g., 'classifier_best.pt').
            class_names (list): A list of class names in the exact order used during training.
            architecture (str): The model architecture to build (e.g., 'mobilenet_v3_small').
            num_classes (int): The number of output classes.
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # --- Build MobileNetV3 Small Architecture ---
        # Load the model with pre-trained ImageNet weights, as the saved state_dict
        # likely only contains the weights for the classifier head.
        if architecture == 'mobilenet_v3_small':
            self.model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
            num_ftrs = self.model.classifier[0].in_features
            self.model.classifier = nn.Sequential(
                nn.Linear(num_ftrs, 256),
                nn.ReLU(),
                nn.Linear(256, num_classes)
            )
            logging.info("Building MobileNetV3-Small architecture.")
        elif architecture == 'efficientnet_b0':
            self.model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
            num_ftrs = self.model.classifier[1].in_features
            self.model.classifier[1] = nn.Linear(num_ftrs, num_classes)
            logging.info("Building EfficientNet-B0 architecture.")
        elif architecture == 'resnet50':
            self.model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
            num_ftrs = self.model.fc.in_features
            self.model.fc = nn.Sequential(
                nn.Linear(num_ftrs, 256),
                nn.ReLU(),
                nn.Dropout(p=0.3),
                nn.Linear(256, num_classes)
            )
            logging.info("Building ResNet50 architecture.")
        else:
            raise ValueError(f"Unsupported architecture: {architecture}")

        # Load your trained classifier weights. strict=False allows loading a partial state_dict.
        self.model.load_state_dict(torch.load(model_path, map_location=self.device), strict=False)
        self.model.to(self.device)
        self.model.eval() # Set to evaluation mode
        
        if len(class_names) != num_classes:
            raise ValueError(f"Number of class names ({len(class_names)}) does not match num_classes ({num_classes}).")
        self.class_names = class_names
        logging.info(f"Classifier configured with class order: {self.class_names}")
        
        # Define image transformations
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        logging.info(f"Classifier '{model_path}' loaded on device: {self.device}")

    def predict(self, image: Image.Image):
        """
        Runs cultivar classification on the input image.

        Args:
            image (Image.Image): The input image (cropped pineapple) in PIL format.

        Returns:
            tuple: A tuple containing the predicted cultivar name (str) and the
                   confidence score (float).
        """
        logging.info("Running cultivar classification...")
        
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
