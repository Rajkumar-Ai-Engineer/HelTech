import sys 
from HealthCare.exception.HealthAI import HealthAIException
from HealthCare.logging.logger import logging


def read_txt_file(file_path: str):
    """Read text from a file.

    Args:
        file_path (str): Path to the text file.
    """ 
    with open(file_path, 'r', encoding='utf-8') as file:
        try:
            logging.info(f"Reading text file from: {file_path}")
            content = file.read()
            logging.info("File read successfully")
            return content
        except Exception as e:
            logging.error(f"Error reading file {file_path}: {e}")
            raise HealthAIException(e, sys)
        