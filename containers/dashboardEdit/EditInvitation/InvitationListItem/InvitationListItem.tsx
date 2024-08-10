import styles from './InvitationListItem.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/Button';
import instance from '@/services/axios';

function InvitationListItem({ item, id }: any) {
  const queryClient = useQueryClient();
  const deleteInvitationMutation = useMutation({
    mutationFn: () =>
      instance.delete(`/dashboards/${id}/invitations/${item.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['invitations'],
      });
    },
    onError: (error) => {
      console.error('Error deleting invitation:', error);
    },
  });

  const handleDeleteClick = () => {
    deleteInvitationMutation.mutate();
  };

  return (
    <div className={styles['container']}>
      <span className={styles['invitation-email']}>{item.invitee.email}</span>
      <Button onClick={handleDeleteClick} buttonType='delete'>
        취소
      </Button>
    </div>
  );
}

export default InvitationListItem;
