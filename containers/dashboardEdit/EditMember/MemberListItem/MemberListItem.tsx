import styles from './MemberListItem.module.scss';
import Image from 'next/image';
import Button from '@/components/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/services/axios';
import { ProfileIcon } from '@/components/ProfileIcon/ProfileIcon';
import useToast from '@/hooks/useToast';
import { useTheme } from '@/hooks/useThemeContext';

//타입정리 필요
function MemberListItem({ item }: { item: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { theme } = useTheme();
  const themeStyle = styles[`${theme}`];

  const deleteMemberMutation = useMutation({
    mutationFn: () => instance.delete(`/members/${item.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dashboardMember'],
      });
      toast('success', '구성원을 성공적으로 삭제 했습니다.');
    },
    onError: (err) => {
      toast('error', `${err.response.data.message}`);
    },
  });

  const handleDeleteClick = () => {
    deleteMemberMutation.mutate();
  };
  return (
    <div className={`${styles['container']} ${themeStyle}`}>
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
