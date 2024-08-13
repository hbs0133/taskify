import styles from './DashboardList.module.scss';
import Button from '@/components/Button';
import { useQuery } from '@tanstack/react-query';
import instance from '@/services/axios';
import { useState } from 'react';
import { useRouter } from 'next/router';
import CreateDashboardModal from '../CreateDashboardModal';
import { useCreateDashboardModalStore } from '@/stores/modalStore';
import ButtonForDashboard from '@/components/ButtonForDashboard';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/Pagination';
import { useTheme } from '@/hooks/useThemeContext';

const fetchDashboards = async (page: number) => {
  const response = await instance.get(
    `/dashboards?navigationMethod=pagination&page=${page}&size=5`,
  );
  return response.data;
};

function DashboardList() {
  const [page, setPage] = useState(1);
  const { isModalOpen, setOpenModal } = useCreateDashboardModalStore();
  const router = useRouter();
  const { theme } = useTheme();
  const themeStyle = styles[`${theme}`];

  const { isLoading, error, data } = useQuery({
    queryKey: ['dashboard', page],
    queryFn: () => fetchDashboards(page),
  });

  const handleClickDashboard = (dashboardId: number) => {
    router.push(`/dashboard/${dashboardId}`);
  };

  const { totalPage, handleNextPage, handlePreviousPage } = usePagination(
    data,
    page,
    setPage,
    'dashboards',
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={`${styles['container']} ${themeStyle}`}>
      <div className={styles['dash-board-list']}>
        <Button buttonType='add-board' onClick={setOpenModal}>
          새로운 대시보드
        </Button>
        {data &&
          data.dashboards.map((item: IDashboard) => (
            <ButtonForDashboard
              key={item.id}
              color={item.color}
              isOwner={item.createdByMe}
              onClick={() => handleClickDashboard(item.id)}
            >
              {item.title}
            </ButtonForDashboard>
          ))}
      </div>
      <Pagination
        page={page}
        totalPage={totalPage}
        onNext={handleNextPage}
        onPrev={handlePreviousPage}
      />
      {isModalOpen && <CreateDashboardModal />}
    </div>
  );
}

export default DashboardList;
