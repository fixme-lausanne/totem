from threading import Thread
import os
import json

INPUT_BUFFER = 4200 # 30 tweets

class Dispatcher:
    def __init__(self, fifo_input):
        self._input = os.open(fifo_input, os.O_RDONLY | os.O_NONBLOCK)
        self._queue = []

    def read(self):
        return Thread(target=self._read).start()

    def _read(self):
        while True:
            try:
                buffer = os.read(self._input, INPUT_BUFFER)
                if buffer:
                    data = json.loads(buffer.decode('utf-8'))
                    self._insert(data)
                    print(data)
            except BlockingIOError:
                pass

    def _insert(self, elem):
        self._queue.append(elem)

    def dispatch(self, filter_callback=None):
        if filter_callback:
            value = filter(filter_callback, self._queue)
            print(value)

        Thread(target=self._dispatch).start()

    def _dispatch(self):
        last_value = []
        while True:
            if last_value != self._queue:
                print(self._queue)
            last_value = self._queue
