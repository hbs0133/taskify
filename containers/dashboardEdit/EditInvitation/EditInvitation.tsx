import styles from './EditInvitation.module.scss';
import Button from '@/components/Button';
import ButtonSet from '@/components/ButtonSet';
import InvitationListItem from './InvitationListItem/InvitationListItem';

function EditInvitation() {
  return (
    <div>
      {' '}
      <div className={styles['container']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-header-title']}>초대내역</h2>
          {/*페이지네이션 부분은 컴포넌트화 예정입니다! */}
          <div className={styles['pagination']}>
            <div>
              <span>1 </span>페이지 중 <span> 1</span>
            </div>
            <ButtonSet buttonSetType='pagenation'>
              <Button buttonType='pagenation'></Button>
              <Button buttonType='pagenation'></Button>
            </ButtonSet>
          </div>
        </div>
        <div className={styles['invitation-list']}>
          <p className={styles['invitation-list-header-title']}>이메일</p>
          <InvitationListItem />
          <InvitationListItem />
          <InvitationListItem />
          <InvitationListItem />
          <InvitationListItem />
        </div>
      </div>
    </div>
  );
}

export default EditInvitation;
