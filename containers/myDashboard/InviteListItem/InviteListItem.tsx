import styles from './InviteListItem.module.scss';
import Button from '@/components/Button';
import ButtonSet from '@/components/ButtonSet';

function InviteListItem() {
  return (
    <div className={styles['invite-list-item-wrapper']}>
      <div className={styles['invite-list-item-name']}>
        <span className={styles['invite-list-header-title']}>이름</span>
        <span>프로덕트 디자인</span>
      </div>
      <div className={styles['invite-list-item-visiter']}>
        <span className={styles['invite-list-header-title']}>초대자</span>
        <span>손동희</span>
      </div>
      <div className={styles['invite-list-item-invite-accepted-buttons']}>
        <ButtonSet buttonSetType='primary'>
          <Button buttonType='primary'>수락</Button>
          <Button buttonType='secondary'>거절</Button>
        </ButtonSet>
      </div>
    </div>
  );
}

export default InviteListItem;
