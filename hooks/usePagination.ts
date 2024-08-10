import { useEffect, useState } from 'react';

export const usePagination = (
  data: any,
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  dataKey: string,
  pageSize: number = 5,
) => {
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    if (data) {
      const totalCount = data.totalCount;
      setTotalPage(Math.ceil(totalCount / pageSize));
    }
  }, [data, pageSize]);

  const handleNextPage = () => {
    if (data && data[dataKey].length > 0 && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return {
    totalPage,
    handleNextPage,
    handlePreviousPage,
  };
};
