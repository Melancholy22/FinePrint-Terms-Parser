from llm import LLM

import typing
import pydantic


class LLM_Connect():
    def __init__(self):
        self.llm = LLM()
    
    def processText(self, text):
        out = self.llm.query(text, _RiskInfo)
        print(out)


# INTERNAL
class _RiskInfo(pydantic.BaseModel):
    licence_to_use_user_content: typing.Optional[str]
    user_data: typing.Optional[str]
    renewal_of_service: typing.Optional[str]
    limited_liability: typing.Optional[str]
    suspension_of_service: typing.Optional[str]


if __name__ == '__main__': 
    c = LLM_Connect()
    with open("test.txt", 'r') as f:
        text = f.read()
    c.processText(text)