#!/usr/bin/python3
"""
Creation of a caching system
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """class that inherits from BaseCaching"""
    def put(self, key, item):
        """store data in the cache"""
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """retrieves data from thr cache"""
        if key and key in self.cache_data.keys():
            return self.cache_data[key]
        return None
