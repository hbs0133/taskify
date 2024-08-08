import styles from './EditMember.module.scss';
import MemberListItem from './MemberListItem/MemberListItem';
import ButtonSetForPagination from '@/components/ButtonSetForPagination/Button';
import instance from '@/services/axios';
import { useQuery } from '@tanstack/react-query';

function EditMember({ id }: { id: string | string[] | undefined }) {
  //페이지는 변수로 관리하여 페이지네이션 구현예정
  const fetchDashboardMember = async (id: string | string[] | undefined) => {
    const response = await instance.get(
      `/members?page=1&size=5&dashboardId=${id}`,
    );
    return response.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['dashboardMember', id],
    queryFn: () => fetchDashboardMember(id),
    enabled: !!id,
  });

  return (
    <div className={styles['container']}>
      <div className={styles['section-header']}>
        <h2 className={styles['section-header-title']}>구성원</h2>
        <div className={styles['pagination']}>
          <div>
            <span>1 </span>페이지 중 <span> 1</span>
          </div>
          {/* <ButtonSetForPagination size='small'></ButtonSetForPagination> */}
        </div>
      </div>
      <div className={styles['member-list']}>
        <p className={styles['member-list-header-title']}>이름</p>

        {
          //타입정리 필요
          data?.members.map((item: any) => (
            <MemberListItem item={item} />
          ))
        }
      </div>
    </div>
  );
}

export default EditMember;
