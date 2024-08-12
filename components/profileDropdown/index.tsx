import Dropdown from '@/containers/dashboard/id/dropdown/Dropdown';
import styles from './index.module.scss';
import useDetectClose from '@/hooks/useDetectClose';
import { useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { ProfileIcon } from '../ProfileIcon/ProfileIcon';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';

function ProfileDropdown({}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useDetectClose(dropdownRef, false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { user, setUser } = useUserStore();

  const handleOpenDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // 쿠키 삭제
    deleteCookie('token'); // 쿠키 이름은 실제 사용 중인 이름으로 변경

    // 사용자 데이터 초기화
    setUser(
      {
        id: 0,
        email: '',
        nickname: '',
        profileImageUrl: null,
        createdAt: '',
        updatedAt: '',
      },
      '',
    );

    // React Query 캐시 초기화
    queryClient.clear();

    // 로그인 페이지로 리다이렉트
    router.replace('/signin');
  };

  if (!user) return <></>;

  return (
    <div ref={dropdownRef} className={styles['dropdown']}>
      <div onClick={handleOpenDropdown} className={`${styles['dashboard-my']}`}>
        <ProfileIcon
          nickname={user.nickname}
          imageUrl={user.profileImageUrl as string | null}
        />
        <p>{user.nickname}</p>
      </div>

      <Dropdown visibility={isOpen}>
        <ul className={styles['container']}>
          <li className={styles['list']} onClick={() => router.push('/mypage')}>
            마이페이지
          </li>
          <li className={styles['list']} onClick={handleLogout}>
            로그아웃
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}

export default ProfileDropdown;
