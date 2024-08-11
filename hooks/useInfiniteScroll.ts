import { useInfiniteQuery } from '@tanstack/react-query';
import axios from '@/services/axios';
import useToast from './useToast';
import { title } from 'process';

interface IParam {
  size: number;
  cursorId: number | null;
  columnId?: number;
  title?: string;
}

const infiniteFetchDateList = async ({
  type,
  pageParam = null,
  queryKey,
  title,
}: {
  type: 'card' | 'invitation';
  pageParam?: number | null;
  queryKey: [string, number] | [string, string];
  title?: string;
}) => {
  const SIZE = 5;
  const cursorId = pageParam;
  const [_, id] = queryKey;

  try {
    if (type === 'card') {
      const res = await axios.get(`/cards`, {
        params: {
          size: SIZE,
          cursorId,
          columnId: id,
        },
      });

      return res.data;
      //   return {
      //     data: res.data,
      //     totalCount: res.data.totalCount,
      //   };
    } else if (type === 'invitation') {
      const params: IParam = {
        size: SIZE,
        cursorId,
      };

      if (title !== '') {
        params.title = title;
      }

      const res = await axios.get(`/invitations`, {
        params,
      });
      return res.data;
    }
  } catch (e: any) {
    throw new Error(e.message);
  }
};

/**
 *
 * @param type card | invitation : card를 받는지 invitation을 받는지
 * @param pageQueryKey [string, number] | [string] : queryKey
 * @param title string | undefined : invitation의 검색 타이틀 (optional)
 * @returns data : 사용하는 데이터
 * @returns totalCount : 해당 데이터 개수
 * @returns fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error
 */
function useInfiniteScroll(
  type: 'card' | 'invitation',
  pageQueryKey: [string, number] | [string, string],
  title?: string,
) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: pageQueryKey,
    queryFn: ({ pageParam = null }) =>
      infiniteFetchDateList({ type, pageParam, queryKey: pageQueryKey, title }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.cursorId || null;
    },
    select: (data) => {
      const items =
        type === 'card'
          ? data.pages.flatMap((page) => page.cards) ?? []
          : data.pages.flatMap((page) => page.invitations) ?? [];
      const totalCount = data.pages[0]?.totalCount || 0;
      return { items, totalCount };
    },
  });

  return {
    data: data?.items,
    totalCount: data?.totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  };
}

export default useInfiniteScroll;
