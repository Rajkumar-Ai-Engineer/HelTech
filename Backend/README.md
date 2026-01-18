# **Agent-1:Medical Prescription Agent**
- Implementation
     Steps:
          - 1.Upload the image
          - 2.Agent Orchestration
               - 2.1 Extract text from Image via Ocr ->Raw output
               - 2.2 Extract medications from Raw ocr output -> json structured details(using llm)
               - 2.3 Parse medications one by one to get details for food suggestions
                    - 2.3.1 Get Medications
                    - 2.3.2 parse Rag tool
                    - 2.3.3 Get the data from the Knowledgebase
                    - 2.3.4 Either it Found or not Not Found using Similarity Search using RPC
                    - 2.3.5 If not found -> use llm prior Knowledge by Ensuring No Hallucinations 
               - 2.4 Return Structured Json Output about the Prescription
     
# **Agent-2:Assistant Agent 
     - Implementation
          Steps:
               - 1.User input via through either text or Audio 
               - 2.Feeds to the Agent with Few Shot Learning (prompt) with Structured Output 
               - 3.Return Response with No Hallucination



               