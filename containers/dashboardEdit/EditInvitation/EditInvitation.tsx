import styles from './EditInvitation.module.scss';
import instance from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import InvitationListItem from './InvitationListItem/InvitationListItem';
import { useInviteModalStore } from '@/stores/modalStore';
import InviteModal from '@/containers/myDashboard/InviteModal';
import { useState, useEffect } from 'react';
import { IconAddBoxWhite } from '@/assets/icongroup';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/Pagination';
import EmptyColumn from '@/containers/dashboard/id/column/EmptyColumn';
import { useTheme } from '@/hooks/useThemeContext';
import Spinner from '@/components/Spinner';

function EditInvitation({ id }: { id: string | string[] | undefined }) {
  const [page, setPage] = useState(1);
  const { theme } = useTheme();
  const themeStyle = styles[`${theme}`];

  const { isModalOpen, setOpenModal } = useInviteModalStore();
  const fetchDashboardInvitations = async (
    id: string | string[] | undefined,
  ) => {
    const response = await instance.get(
      `/dashboards/${id}/invitations?page=${page}&size=5`,
    );
    return response.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['invitations', page],
    queryFn: () => fetchDashboardInvitations(id),
    enabled: !!id,
  });

  const { totalPage, handleNextPage, handlePreviousPage } = usePagination(
    data,
    page,
    setPage,
    'invitations',
  );

  if (isLoading)
    return (
      <div className={`${styles['container']} ${themeStyle}`}>
        <Spinner />
      </div>
    );

  return (
    <div>
      <div className={`${styles['container']} ${themeStyle}`}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-header-title']}>초대내역</h2>
          <div className={styles['section-header-actions']}>
            <Pagination
              page={page}
              totalPage={totalPage}
              onNext={handleNextPage}
              onPrev={handlePreviousPage}
            />
            <button
              className={`${styles['dashboard-manage-button']}`}
              onClick={setOpenModal}
            >
              <div>
                <IconAddBoxWhite
                  style={{ width: '20px', height: '20px' }}
                  aria-label={`add box icon`}
                ></IconAddBoxWhite>
                초대하기
              </div>
            </button>
          </div>
        </div>
        <div className={styles['invitation-list']}>
          <p className={styles['invitation-list-header-title']}>이메일</p>
          {isLoading ? (
            <Spinner />
          ) : data && data.invitations && data.invitations.length > 0 ? (
            data.invitations.map((item: any) => (
              <InvitationListItem key={item.id} id={id} item={item} />
            ))
          ) : (
            <EmptyColumn />
          )}
        </div>
      </div>
      {isModalOpen && <InviteModal id={id} />}
    </div>
  );
}

export default EditInvitation;
