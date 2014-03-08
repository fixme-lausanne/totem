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

    def dispatch(self, output, predicate=None):
        Thread(
            target=self._dispatch(output, predicate)
        ).start()

    def _dispatch(self, output, predicate):
        value = self._queue
        last_value = []
        while True:
            if predicate:
                value = list(self._filter_by_predicate(self._queue, predicate))

            if last_value != value:
                output(value)
                print("\nFiltered values:")
                for x in value:
                    print("\t", x)
                print("\n")
            last_value = value

    def _filter_by_predicate(self, data, predicate):
        return filter(
            predicate, data
        )
