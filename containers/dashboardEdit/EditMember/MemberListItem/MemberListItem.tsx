import styles from './MemberListItem.module.scss';
import Image from 'next/image';
import Button from '@/components/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/services/axios';
import { ProfileIcon } from '@/components/ProfileIcon/ProfileIcon';

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
        <ProfileIcon nickname={item.nickname} imageUrl={item.imageUrl} />
        <span className={styles['member-name']}>{item?.nickname}</span>
      </div>
      {!item.isOwner && (
        <Button onClick={handleDeleteClick} buttonType='delete'>
          삭제
        </Button>
      )}
    </div>
  );
}

export default MemberListItem;
