#!/usr/bin/python3
"""
Creation of a LRU caching system
"""
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """class that inherits from BaseCaching"""
    def __init__(self):
        """constructor functio"""
        super().__init__()
        self.acces = {}
        self.weight = 0

    def put(self, key, item):
        """store data in the cache"""
        if key and item:
            if len(self.cache_data) + 1 > self.MAX_ITEMS:
                least_w = list(self.acces.values())
                least_w.sort()
                least = least_w[0]
                for k in self.acces.keys():
                    if key in self.cache_data.keys():
                        break
                    if self.acces.get(k) == least:
                        print(self.acces)
                        print("DISCARD: {}".format(k))
                        del(self.cache_data[k])
                        del(self.acces[k])
                        break

            self.cache_data[key] = item
            self.acces[key] = self.weight

    def get(self, key):
        """retrieves data from thr cache"""
        if key and key in self.cache_data.keys():
            self.weight += 1
            self.acces[key] = self.weight
            return self.cache_data[key]
        return None
