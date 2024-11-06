#!/usr/bin/python3
"""
Creation of a LIFO caching system
"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """class that inherits from BaseCaching"""
    def put(self, key, item):
        """store data in the cache"""
        if key and item:
            self.cache_data[key] = item
        if len(self.cache_data) > self.MAX_ITEMS:
            key = list(self.cache_data.keys())[-2]
            print("DISCARD: {}".format(key))
            del(self.cache_data[key])

    def get(self, key):
        """retrieves data from thr cache"""
        if key and key in self.cache_data.keys():
            return self.cache_data[key]
        return None
