import styles from './InviteListItem.module.scss';
import Button from '@/components/Button';
import ButtonSet from '@/components/ButtonSet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/services/axios';

function InviteListItem({ item }: { item: IInvitation }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (inviteAccepted: boolean) => {
      return instance.put(`/invitations/${item.id}`, { inviteAccepted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['invitations'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboards'],
      });
    },
    onError: (error) => {
      console.error('Error updating invitation:', error);
    },
  });

  const handleAccept = () => {
    mutation.mutate(true);
  };

  const handleReject = () => {
    mutation.mutate(false);
  };

  return (
    <div className={styles['invite-list-item-wrapper']}>
      <div className={styles['invite-list-item-name']}>
        <span className={styles['invite-list-header-title']}>이름</span>
        <span>{item.dashboard.title}</span>
      </div>
      <div className={styles['invite-list-item-visiter']}>
        <span className={styles['invite-list-header-title']}>초대자</span>
        <span>{item.inviter.nickname}</span>
      </div>
      <div className={styles['invite-list-item-invite-accepted-buttons']}>
        <ButtonSet buttonSetType='primary'>
          <Button buttonType='primary' onClick={handleAccept}>
            수락
          </Button>
          <Button buttonType='secondary' onClick={handleReject}>
            거절
          </Button>
        </ButtonSet>
      </div>
    </div>
  );
}

export default InviteListItem;
