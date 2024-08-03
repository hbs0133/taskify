import styles from './InvitationListItem.module.scss';

import Button from '@/components/Button';

function InvitationListItem() {
  return (
    <div className={styles['container']}>
      <span className={styles['invitation-email']}>codeitA@codeit.com</span>
      <Button buttonType='delete'>취소</Button>
    </div>
  );
}

export default InvitationListItem;
