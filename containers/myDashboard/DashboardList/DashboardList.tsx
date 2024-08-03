import styles from './DashboardList.module.scss';
import Button from '@/components/Button';
import ButtonSet from '@/components/ButtonSet';

function DashboardList() {
  return (
    <div className={styles['container']}>
      <div className={styles['dash-board-list']}>
        <Button buttonType='add-board'>새로운 대시보드</Button>
        <Button buttonType='dashboard' isOwner={true}>
          비브리지
        </Button>
        <Button buttonType='dashboard' isOwner={true}>
          코드잇
        </Button>
        <Button buttonType='dashboard'>3분기 계획</Button>
        <Button buttonType='dashboard'>회의록</Button>
      </div>
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
  );
}

export default DashboardList;
