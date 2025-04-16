
from llm_connect import LLM_Connect


c = LLM_Connect()
with open("test.txt", 'r') as f:
    text = f.read()
c.processText(text)