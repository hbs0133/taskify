import styles from './EditMember.module.scss';
import Button from '@/components/Button';
import ButtonSet from '@/components/ButtonSet';
import MemberListItem from './MemberListItem/MemberListItem';

function EditMember() {
  return (
    <div className={styles['container']}>
      <div className={styles['section-header']}>
        <h2 className={styles['section-header-title']}>구성원</h2>
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
      <div className={styles['member-list']}>
        <p className={styles['member-list-header-title']}>이름</p>
        <MemberListItem />
        <MemberListItem />
        <MemberListItem />
        <MemberListItem />
      </div>
    </div>
  );
}

export default EditMember;
