import InviteListItem from '../InviteListItem/InviteListItem';
import styles from './InvitedDashboard.module.scss';
import { IconSearch, IconSearchDark } from '@/assets/icongroup';
import { useState, useEffect } from 'react';
import EmptyColumn from '@/containers/dashboard/id/column/EmptyColumn';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '@/hooks/useThemeContext';

function InvitedDashboard() {
  const [searchValue, setSearchValue] = useState('');
  const { ref, inView } = useInView();
  const { theme } = useTheme();
  const themeStyle = styles[`${theme}`];

  const {
    data,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteScroll(
    'invitation',
    ['invitations', searchValue],
    searchValue,
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className={`${styles['container']} ${themeStyle}`}>
      <h2 className={styles['title']}>초대받은 대시보드</h2>
      <div className={styles['search-wrapper']}>
        {theme !== 'dark' ? <IconSearch /> : <IconSearchDark />}
        <input
          type='text'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder='검색'
        />
      </div>
      {isLoading ? (
        <div className={styles['loading']}>loading...</div>
      ) : (
        <>
          {data && data.length > 0 ? (
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
                {hasNextPage && (
                  <div ref={ref} className={styles['ref']}>
                    .
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles['empty-wrapper']}>
              <EmptyColumn />
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default InvitedDashboard;
