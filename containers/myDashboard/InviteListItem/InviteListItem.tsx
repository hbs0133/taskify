import styles from './InviteListItem.module.scss';
import Button from '@/components/Button';
import ButtonSet from '@/components/ButtonSet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/services/axios';
import useToast from '@/hooks/useToast';
import { useState } from 'react';
import { useTheme } from '@/hooks/useThemeContext';

function InviteListItem({ item }: { item: IInvitation }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [inviteAccepted, setInviteAccepted] = useState<boolean | null>(null);
  const { theme } = useTheme();
  const themeStyle = styles[`${theme}`];

  const mutation = useMutation({
    mutationFn: (inviteAccepted: boolean) => {
      return instance.put(`/invitations/${item.id}`, { inviteAccepted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['invitations'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });

      if (inviteAccepted === true) {
        toast('success', '초대를 성공적으로 수락했습니다.');
      } else if (inviteAccepted === false) {
        toast('success', '초대를 성공적으로 거절했습니다.');
      }
    },
    onError: (err) => {
      toast('error', `${err.response.data.message}`);
    },
  });

  const handleAccept = () => {
    setInviteAccepted(true);
    mutation.mutate(true);
  };

  const handleReject = () => {
    setInviteAccepted(false);
    mutation.mutate(false);
  };

  return (
    <div className={`${styles['invite-list-item-wrapper']} ${themeStyle}`}>
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
