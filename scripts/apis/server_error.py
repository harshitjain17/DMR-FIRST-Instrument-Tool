class ServerError(Exception):
    # Exception raised for unexepcted Server results
    def __init__(self, data: dict, code: int, message: str):
        self.status_code = code
        self.message = message
        self.data = data

    def __str__(self):
        return f'Error {self.code} - {self.message}'