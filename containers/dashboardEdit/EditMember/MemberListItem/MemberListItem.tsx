import styles from './MemberListItem.module.scss';
import Image from 'next/image';
import profileImage from '@/assets/images/img_profileImg.png';
import Button from '@/components/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/services/axios';

//타입정리 필요
function MemberListItem({ item }: { item: any }) {
  const queryClient = useQueryClient();
  const deleteMemberMutation = useMutation({
    mutationFn: () => instance.delete(`/members/${item.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dashboardMember'],
      });
    },
    onError: (error) => {
      console.error('Error deleting invitation:', error);
    },
  });

  const handleDeleteClick = () => {
    deleteMemberMutation.mutate();
  };
  return (
    <div className={styles['container']}>
      <div className={styles['member-info']}>
        {item.profileUrl ? (
          <Image
            src={item.profileUrl}
            width={38}
            height={38}
            className={styles['member-profile-image']}
            alt='프로필 이미지'
          />
        ) : null}

        <span className={styles['member-name']}>{item?.nickname}</span>
      </div>
      <Button onClick={handleDeleteClick} buttonType='delete'>
        삭제
      </Button>
    </div>
  );
}

export default MemberListItem;
