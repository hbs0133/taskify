import styles from './DashboardList.module.scss';
import Button from '@/components/Button';
import { useQuery } from '@tanstack/react-query';
import instance from '@/services/axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ButtonSetForPagination from '@/components/ButtonSetForPagination/Button';
import CreateDashboardModal from '../CreateDashboardModal';
import { useCreateModalStore } from '@/stores/modalStore';

const fetchDashboards = async (cursorId: number, page: number) => {
  const response = await instance.get(
    `/dashboards?navigationMethod=pagination&cursorId=${cursorId}&page=${page}&size=5`,
  );
  return response.data;
};

function DashboardList() {
  const [page, setPage] = useState(1);
  const [cursorId, setCursorId] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const { isModalOpen, setOpenModal } = useCreateModalStore();
  const router = useRouter();

  const { isLoading, error, data } = useQuery({
    queryKey: ['dashboards', cursorId, page, 5],
    queryFn: () => fetchDashboards(cursorId, page),
  });

  const handleNextPage = () => {
    if (data && data.dashboards.length > 0 && page < totalPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleClickDashboard = (dashboardId: number) => {
    router.push(`/dashboard/${dashboardId}`);
  };

  useEffect(() => {
    if (data) {
      const totalCount = data.totalCount;
      const pageSize = 5;
      setTotalPage(Math.ceil(totalCount / pageSize));
    }
  }, [data]);

  console.log(data);
  return (
    <div className={styles['container']}>
      <div className={styles['dash-board-list']}>
        <Button buttonType='add-board' onClick={setOpenModal}>
          새로운 대시보드
        </Button>
        {data &&
          data.dashboards.map((item: IDashboard) => (
            <Button
              key={item.id}
              buttonType='dashboard'
              isOwner={item.createdByMe}
              onClick={() => handleClickDashboard(item.id)}
            >
              {item.title}
            </Button>
          ))}
      </div>
      <div className={styles['pagination']}>
        <div className={styles['pagination-number']}>
          <span>{totalPage} </span>페이지 중 <span>{page}</span>
        </div>
        <ButtonSetForPagination
          size='large'
          onClickToNext={handleNextPage}
          onClickToPrev={handlePreviousPage}
        ></ButtonSetForPagination>
      </div>
      {isModalOpen && <CreateDashboardModal />}
    </div>
  );
}

export default DashboardList;
