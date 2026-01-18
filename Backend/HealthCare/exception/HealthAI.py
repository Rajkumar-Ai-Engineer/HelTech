import sys 

def error_message_detail(error,error_detail:sys):
    _,_,file_exc = error_detail.exc_info()
    linenumber = file_exc.tb_lineno
    filename = file_exc.tb_frame.f_code.co_filename
    error_message = "Error occured in python script name [{0}] line number [{1}] error message [{2}]".format(
        filename,linenumber,str(error)
    )
    return error_message

class HealthAIException(Exception):
    def __init__(self,error_message,error_detail:sys):
        super().__init__(error_message)
        self.error_message = error_message_detail(error_message,error_detail)
    def __str__(self):
        return self.error_message
    
    
        