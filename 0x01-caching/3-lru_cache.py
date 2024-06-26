#!/usr/bin/env python3
""" Create a class LRUCache that
    inherits from BaseCaching and
        is a caching system """
from base_caching import BaseCaching
from collections import OrderedDict


class LRUCache(BaseCaching):
    """ Implements a Least-Recently-Used (LRU) caching strategy """

    def __init__(self):
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """ Put an item into the cache """
        if key is not None and item is not None:
            if len(self.cache_data) >= self.MAX_ITEMS:
                least_key = next(iter(self.cache_data))
                del self.cache_data[least_key]
                print("DISCARD:", least_key)

            self.cache_data[key] = item
            self.cache_data.move_to_end(key)

    def get(self, key):
        """ Get an item from the cache by key """
        if key in self.cache_data:
            self.cache_data.move_to_end(key)
        return self.cache_data.get(key, None)
