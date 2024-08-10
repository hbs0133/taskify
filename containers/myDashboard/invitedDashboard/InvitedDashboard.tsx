import InviteListItem from '../InviteListItem/InviteListItem';
import styles from './InvitedDashboard.module.scss';
import { IconEmptyInvitation, IconSearch } from '@/assets/icongroup';
import { useQuery } from '@tanstack/react-query';
import instance from '@/services/axios';
import { useState } from 'react';
import EmptyColumn from '@/containers/dashboard/id/column/EmptyColumn';

function InvitedDashboard() {
  const [searchValue, setSearchValue] = useState('');

  //민경님 pr 머지후 pull하면 무한스크롤로 변경 !
  const { isLoading, error, data } = useQuery({
    queryKey: ['invitations', searchValue],
    queryFn: async () => {
      //이부분 검색어가 없을시 empty컴포넌트 나오는 이슈 팀미팅해야겠다...
      const response = await instance.get(`/invitations`);
      return response.data.invitations;
    },
  });
  //?title=${searchValue}

  return (
    <div className={styles['container']}>
      <h2 className={styles['title']}>초대받은 대시보드</h2>
      {data && data.length > 0 ? (
        <>
          <div className={styles['search-wrapper']}>
            <IconSearch />
            <input
              type='text'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder='검색'
            />
          </div>
          <div className={styles['invite-list-table']}>
            <div className={styles['invite-list-table-header']}>
              <div className={styles['invite-list-table-header-name']}>
                이름
              </div>
              <div className={styles['invite-list-table-header-inviter']}>
                초대자
              </div>
              <div
                className={styles['invite-list-table-header-invite-accepted']}
              >
                수락 여부
              </div>
            </div>
            <div className={styles['invite-list-table-body']}>
              {data.map((item: IInvitation) => (
                <InviteListItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <EmptyColumn />
      )}
    </div>
  );
}

export default InvitedDashboard;
