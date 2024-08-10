import styles from './EditInvitation.module.scss';
import instance from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import InvitationListItem from './InvitationListItem/InvitationListItem';
import { useCreateModalStore } from '@/stores/modalStore';
import InviteModal from '@/containers/myDashboard/InviteModal';
import ButtonSetForPagination from '@/components/ButtonSetForPagination/Button';
import { useState, useEffect } from 'react';

function EditInvitation({ id }: { id: string | string[] | undefined }) {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const { isModalOpen, setOpenModal } = useCreateModalStore();
  const fetchDashboardInvitations = async (
    id: string | string[] | undefined,
  ) => {
    const response = await instance.get(
      `/dashboards/${id}/invitations?page=1&size=5`,
    );
    return response.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['invitations'],
    queryFn: () => fetchDashboardInvitations(id),
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
    <div>
      <div className={styles['container']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-header-title']}>초대내역</h2>
          <div className={styles['section-header-actions']}>
            <div className={styles['pagination']}>
              <div>
                {' '}
                <span>{totalPage} </span>페이지 중 <span> {page}</span>
              </div>
              <ButtonSetForPagination
                size='large'
                onClickToNext={handleNextPage}
                onClickToPrev={handlePreviousPage}
              ></ButtonSetForPagination>
            </div>
            <button onClick={setOpenModal}>초대하기</button>
          </div>
        </div>
        <div className={styles['invitation-list']}>
          <p className={styles['invitation-list-header-title']}>이메일</p>
          {
            //타입정리 필요
            data?.invitations.map((item: any) => (
              <InvitationListItem key={item.id} id={id} item={item} />
            ))
          }
        </div>
      </div>
      {isModalOpen && <InviteModal id={id} />}
    </div>
  );
}

export default EditInvitation;
