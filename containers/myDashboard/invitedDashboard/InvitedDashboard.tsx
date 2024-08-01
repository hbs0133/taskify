import InviteListItem from '../InviteListItem/InviteListItem';
import styles from './InvitedDashboard.module.scss';
import { IconEmptyInvitation, IconSearch } from '@/assets/icongroup';

function InvitedDashboard() {
  // 데이터 페칭 전 조건부렌더링을 위한 isInvite값
  const isInvite = 1;

  return (
    <div className={styles['container']}>
      <h2 className={styles['title']}>초대받은 대시보드</h2>
      {isInvite ? (
        <>
          <div className={styles['search-wrapper']}>
            <IconSearch />
            <input type='text' placeholder='검색' />
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
              {/*데이터 페칭후 map함수전 확인을 위한 컴포넌트입니다! */}
              <InviteListItem />
              <InviteListItem />
              <InviteListItem />
              <InviteListItem />
              <InviteListItem />
              <InviteListItem />
            </div>
          </div>
        </>
      ) : (
        <div className={styles['empty-invitation-wrapper']}>
          <div className={styles['empty-invitation']}>
            <IconEmptyInvitation />
            <p>아직 초대받은 대시보드가 없어요</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvitedDashboard;
