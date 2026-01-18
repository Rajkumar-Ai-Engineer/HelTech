import logging 
from datetime import datetime 
import os

folder_name:str = "Logs"
log_file_path:str = os.path.join(folder_name,f"Log_{datetime.now().strftime('%Y_%m_%d_%H_%M_%S')}.log")
os.makedirs(folder_name,exist_ok=True)

logging.basicConfig(
    filename=log_file_path,
    datefmt="%Y-%m-%d %H:%M:%S",
    format="%(asctime)s - %(levelname)s - %(message)s",
    level=logging.INFO
)

