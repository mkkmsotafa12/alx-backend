#!/usr/bin/env python3
""" FIFO Cache module """
from base_caching import BaseCaching
from collections import deque


class FIFOCache(BaseCaching):
    """ FIFOCache defines:
    caching system using FIFO algorithm """

    def __init__(self):
        super().__init__()
        self.queue = deque()

    def put(self, key, item):
        """ Put an item into the cache """
        if key is not None and item is not None:
            if len(self.cache_data) >= self.MAX_ITEMS:
                oldest_key = self.queue.popleft()
                del self.cache_data[oldest_key]
                print("DISCARD: {}".format(oldest_key))
            self.cache_data[key] = item
            self.queue.append(key)

    def get(self, key):
        """ Get an item from the cache by key """
        return self.cache_data.get(key, None)
