import styles from './EditMember.module.scss';
import MemberListItem from './MemberListItem/MemberListItem';
import ButtonSetForPagination from '@/components/ButtonSetForPagination/Button';
import instance from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

function EditMember({ id }: { id: string | string[] | undefined }) {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const fetchDashboardMember = async (id: string | string[] | undefined) => {
    const response = await instance.get(
      `/members?page=${page}&size=5&dashboardId=${id}`,
    );
    return response.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['dashboardMember', id],
    queryFn: () => fetchDashboardMember(id),
    enabled: !!id,
  });

  const handleNextPage = () => {
    if (data && data.members.length > 0 && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    if (data) {
      const totalCount = data.totalCount;
      const pageSize = 5;
      setTotalPage(Math.ceil(totalCount / pageSize));
    }
  }, [data]);

  return (
    <div className={styles['container']}>
      <div className={styles['section-header']}>
        <h2 className={styles['section-header-title']}>구성원</h2>
        <div className={styles['pagination']}>
          <div>
            <span>{totalPage} </span>페이지 중 <span> {page}</span>
          </div>
          <ButtonSetForPagination
            size='large'
            onClickToNext={handleNextPage}
            onClickToPrev={handlePreviousPage}
          ></ButtonSetForPagination>
        </div>
      </div>
      <div className={styles['member-list']}>
        <p className={styles['member-list-header-title']}>이름</p>
        {
          //타입정리 필요
          data?.members.map((item: any) => (
            <MemberListItem key={item.id} item={item} />
          ))
        }
      </div>
    </div>
  );
}

export default EditMember;
