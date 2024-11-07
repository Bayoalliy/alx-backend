#!/usr/bin/python3
"""
Creation of a MRU caching system
"""
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """class that inherits from BaseCaching"""
    def __init__(self):
        """constructor functio"""
        super().__init__()
        self.acces = {}
        self.weight = 0

    def put(self, key, item):
        """store data in the cache"""
        if key and item:
            self.cache_data[key] = item
            self.acces[key] = self.weight
            self.weight += 1
        if len(self.cache_data) > self.MAX_ITEMS:
            weights = list(self.acces.values())[:-1]
            weights.sort()
            bgst_w = weights[-1]
            for k in list(self.acces.keys())[:-1]:
                if self.acces.get(k) == bgst_w:
                    print("DISCARD: {}".format(k))
                    del(self.cache_data[k])
                    del(self.acces[k])
                    break

    def get(self, key):
        """retrieves data from the cache"""
        if key and key in self.cache_data.keys():
            self.weight += 1
            self.acces[key] = self.weight
            return self.cache_data[key]
        return None
