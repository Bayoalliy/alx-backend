#!/usr/bin/env python3
"""
This module contains a function that returns a tuple.
"""


def index_range(page, page_size):
    """ index range finder """
    last_index = page * page_size
    first_index = last_index - page_size
    return((first_index, last_index))
