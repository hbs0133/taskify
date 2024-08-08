import styles from './EditInvitation.module.scss';
import instance from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import InvitationListItem from './InvitationListItem/InvitationListItem';

function EditInvitation({ id }: { id: string | string[] | undefined }) {
  //페이지는 변수로 관리하여 페이지네이션 구현예정
  const fetchDashboardInvitations = async (
    id: string | string[] | undefined,
  ) => {
    const response = await instance.get(
      `/dashboards/${id}/invitations?page=1&size=5`,
    );
    return response.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['dashboardInvitation', id],
    queryFn: () => fetchDashboardInvitations(id),
    enabled: !!id,
  });

  return (
    <div>
      <div className={styles['container']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-header-title']}>초대내역</h2>
          <div className={styles['pagination']}>
            <div>
              <span>1 </span>페이지 중 <span> 1</span>
            </div>
          </div>
        </div>
        <div className={styles['invitation-list']}>
          <p className={styles['invitation-list-header-title']}>이메일</p>
          {
            //타입정리 필요
            data?.invitations.map((item: any) => (
              <InvitationListItem item={item} />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default EditInvitation;
