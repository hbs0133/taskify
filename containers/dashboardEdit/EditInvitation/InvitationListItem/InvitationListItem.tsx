import styles from './InvitationListItem.module.scss';

import Button from '@/components/Button';

function InvitationListItem({ item }: any) {
  return (
    <div className={styles['container']}>
      <span className={styles['invitation-email']}>{item.inviter.email}</span>
      <Button buttonType='delete'>취소</Button>
    </div>
  );
}

export default InvitationListItem;
