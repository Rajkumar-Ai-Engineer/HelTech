from HealthCare.config.settings import Prescription_Constants 
from google.cloud import vision
import sys 
from HealthCare.exception.HealthAI import HealthAIException 
from HealthCare.logging.logger import logging

class ImageToOCR:
    def __init__(self):
        self.client = vision.ImageAnnotatorClient.from_service_account_file(Prescription_Constants.OCR_Client_Path)
    def extract_text(self,image_path:str):
        """Extract text from image using Google Vision OCR.

        Args:
            image_path (str): Path to the image file.
        """
        try:
            logging.info("Extracting text")
            with open(image_path, "rb") as image_file:
                content = image_file.read()

            image = vision.Image(content=content)
            response = self.client.document_text_detection(image=image)
            logging.info("Text extraction completed")
            return response.full_text_annotation.text
        except Exception as e:
            logging.error(f"Error in extract_text: {e}")
            raise HealthAIException(e, sys)