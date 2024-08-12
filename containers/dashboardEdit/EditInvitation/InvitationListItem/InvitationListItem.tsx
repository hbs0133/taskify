import styles from './InvitationListItem.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/Button';
import instance from '@/services/axios';
import useToast from '@/hooks/useToast';
import { useTheme } from '@/hooks/useThemeContext';

function InvitationListItem({ item, id }: any) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { theme } = useTheme();
  const themeStyle = styles[`${theme}`];

  const deleteInvitationMutation = useMutation({
    mutationFn: () =>
      instance.delete(`/dashboards/${id}/invitations/${item.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['invitations'],
      });
      toast('success', '초대를 성공적으로 취소했습니다.');
    },
    onError: (err) => {
      toast('error', `${err.response.data.message}`);
    },
  });

  const handleDeleteClick = () => {
    deleteInvitationMutation.mutate();
  };

  return (
    <div className={`${styles['container']} ${themeStyle}`}>
      <span className={styles['invitation-email']}>{item.invitee.email}</span>
      <Button onClick={handleDeleteClick} buttonType='delete'>
        취소
      </Button>
    </div>
  );
}

export default InvitationListItem;
