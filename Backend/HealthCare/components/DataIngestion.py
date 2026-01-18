import sys 
from HealthCare.exception.HealthAI import HealthAIException
from HealthCare.logging.logger import logging 
import pandas as pd 
from langchain_core.documents import Document 
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from HealthCare.config.settings import Prescription_Constants
from supabase import create_client
from langchain_community.vectorstores import SupabaseVectorStore


class DataIngestion:
    def __init__(self):
        self.Embeddings = HuggingFaceEndpointEmbeddings(
            huggingfacehub_api_token=Prescription_Constants.HuggingFaceApiKey,
            model=Prescription_Constants.HuggingFaceEmbedModel
            )
        self.splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=80)
        self.sb_client = create_client(
            supabase_key=Prescription_Constants.Supabase_key,
            supabase_url=Prescription_Constants.Supabase_url
            )
        
    
    def document_data(self,file_path:str):
        try:
            data = pd.read_excel(file_path)
            documents = []
            for _,row in data.iterrows():
                text = f"""
                        Drug Class: {row["Drug Class"]},
                        Drug Name: {row["Drug Name"]},
                        Food Interaction: {row["Food that Interacts"]},
                        Effect: {row["Effect of the Food"]},
                        Clinical Recommentation: {row["Clinical Recommendation"]},
                        Reference: {row["Reference (APA Style)"]}
                        """.strip()
                doc = Document(page_content=text,metadata={"drug_name":row["Drug Name"],"drug_class":row["Drug Class"]})
                documents.append(doc)
            return documents
        except Exception as e:
            logging.error("Document data failed")
            raise HealthAIException(e,sys)
    
    def Chunking(self,docs):
        try:
            chunks = self.splitter.split_documents(docs)
            return chunks
        except Exception as e:
            logging.error("chunking failed")
            raise HealthAIException(e,sys)
        
    def ingest_documents(self,file_path:str):
        try:
            docs = self.document_data(file_path)
            chunks = self.Chunking(docs)
            vs = SupabaseVectorStore(
                client=self.sb_client,
                embedding=self.Embeddings,
                table_name=Prescription_Constants.Table,
                query_name=Prescription_Constants.QueryName
            )
            vs.add_documents(chunks)
            logging.info("Data Ingested Successfully")
        except Exception as e:
            logging.error("Data Ingestion Failed")
            raise HealthAIException(e,sys)
        
if __name__ == "__main__":
    data_ingestion = DataIngestion()
    data_ingestion.ingest_documents(r"C:\Hackathons\Thiagarajar\main\Backend\Artifacts\Updated_medicinations.xlsx")
        
        
    
    
    
    
        

        
    