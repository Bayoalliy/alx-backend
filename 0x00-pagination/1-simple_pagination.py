import csv
import math
from typing import List


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def index_range(self, page, page_size):
        """ index range finder """
        last_index = page * page_size
        first_index = last_index - page_size
        return((first_index, last_index))

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """ function to get the datas in a page"""
        assert isinstance(page, int) and isinstance(page_size, int)
        assert page > 0 and page_size > 0
        self.dataset()
        if page * page_size > len(self.__dataset):
            return []
        idx_range = self.index_range(page, page_size)
        lst = []
        for i in range(idx_range[0], idx_range[1]):
            lst.append(self.__dataset[i])
        return lst
