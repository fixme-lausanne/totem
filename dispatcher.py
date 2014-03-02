from threading import Thread
import os

INPUT_BUFFER = 4200 # 30 tweets

class Dispatcher:
    def __init__(self, fifo_input):
        self._input = os.open(fifo_input, os.O_RDONLY | os.O_NONBLOCK)
        self._queue = []

    def read(self): 
        return Thread(target=dis.read).start()
        
    def _read(self):
        while True:
            try:
                buffer = os.read(self._input, INPUT_BUFFER)            
                if buffer:
                    dis.insert(buffer)
                    print(buffer)
            except BlockingIOError:
                pass

    def insert(self, elem):
        self._queue.append(elem)


dis = Dispatcher('test_input')
# Read the FIFO
dis.read()
