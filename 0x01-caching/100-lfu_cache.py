#!/usr/bin/python3
"""
Creation of a LFU(least frquently used) caching Algorithm
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """class that inherits from BaseCaching"""
    def __init__(self):
        """constructor functio"""
        super().__init__()
        self.acces_freq = {}

    def put(self, key, item):
        """store data in the cache"""
        if key and item:
            self.cache_data[key] = item
            if key in self.acces_freq.keys():
                self.acces_freq[key] += 1
            else:
                self.acces_freq[key] = 0
        if len(self.cache_data) > self.MAX_ITEMS:
            freq = list(self.acces_freq.values())[:-1]
            freq.sort()
            least_freq = freq[0]
            for k in list(self.acces_freq.keys())[:-1]:
                if self.acces_freq.get(k) == least_freq:
                    print("DISCARD: {}".format(k))
                    del(self.cache_data[k])
                    del(self.acces_freq[k])
                    break

    def get(self, key):
        """retrieves data from the cache"""
        if key and key in self.cache_data.keys():
            self.acces_freq[key] += 1
            return self.cache_data[key]
        return None
