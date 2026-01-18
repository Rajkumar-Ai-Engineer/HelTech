import sys 
from HealthCare.exception.HealthAI import HealthAIException
from HealthCare.logging.logger import logging 

from supabase import create_client 
import pandas as pd 
from langchain_core.documents import Document 

try:
    logging.info("ETL started")
    df = pd.read_excel(r"C:\Hackathons\Thiagarajar\Artifacts\DRUG FOOD INTERACTION.xlsx")

    documents = []

    for _,row in df.iterrows():
        text = f"""
            Drug Class: {row["Drug Class"]},
            Drug Name: {row["Drug Name"]},
            Food Interaction: {row["Food that Interacts"]},
            Effect: {row["Effect of the Food"]},
            Clinical Recommentation: {row["Clinical Recommendation"]},
            Reference: {row["Reference (APA Style)"]}
        """.strip()
        documents.append(Document(page_content=text,metadata={"drug_name":row["Drug Name"],"drug_class":row["Drug Class"]}))
        
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=80)
    chunks = text_splitter.split_documents(documents)

    from dotenv import load_dotenv
    load_dotenv()
    import os
    hf_api_key = os.getenv("HUGGINGFACE_API_KEY")
    from langchain_huggingface import HuggingFaceEndpointEmbeddings

    embeddings = HuggingFaceEndpointEmbeddings(
                huggingfacehub_api_token=hf_api_key,
                model="sentence-transformers/all-MiniLM-L6-v2"
            )


    from langchain_community.vectorstores import SupabaseVectorStore
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    supabase = create_client(supabase_url=url, supabase_key=key)
    
    # Ensure table exists with correct schema
    # create_table_sql = """
    # CREATE TABLE IF NOT EXISTS drug_food_prescriptions(
    #     id BIGSERIAL PRIMARY KEY,
    #     content TEXT,
    #     metadata JSONB,
    #     embedding VECTOR(384)
    # );
    # """
    
    # try:
    #     # Execute SQL to create table
    #     result = supabase.rpc('exec_sql', {'query': create_table_sql}).execute()
    # except Exception as table_error:
    #     logging.warning(f"Table creation attempt failed: {table_error}")
    #     # Continue anyway - table might already exist
    
    vs = SupabaseVectorStore(
        client=supabase,
        embedding=embeddings,
        table_name="documents",
        query_name="similarity_search_documents"
    )
    # vs.add_documents(chunks)
    
    logging.info("ETL completed")
except Exception as e:
    logging.error("ETL failed")
    raise HealthAIException(e, sys)

query = "Amiodarone"
# query_embedding = embeddings.embed_query(query)
# res = vs.similarity_search(query, 3)

# Test similarity search
# try:
#     query = "heart medication grapefruit"
#     query_embedding = embeddings.embed_query(query)
    
#     search_result = supabase.rpc("similarity_search_documents", {
#         "query_embedding": query_embedding,
#         "match_threshold": 0.3,
#         "match_count": 3
#     }).execute()
    
#     print(f"Similarity search results for '{query}':")
#     for match in search_result.data:
#         print(f"Similarity: {match['similarity']:.3f}")
#         print(f"Content: {match['content'][:200]}...")
#         print(f"Metadata: {match.get('metadata', {})}")
#         print("---")
# except Exception as search_error:
#     print(f"Similarity search failed: {search_error}")
    
    