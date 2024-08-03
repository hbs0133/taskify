import Link from 'next/link';
import styles from './DashboardEdit.module.scss';
import EditDashboardName from './EditDashboardName/EditDashboardName';
import EditInvitation from './EditInvitation/EditInvitation';
import EditMember from './EditMember/EditMember';
import Button from '@/components/Button';

//데이터 페칭전 임시id값입니다.
const id = 1;

function DashboardEdit() {
  return (
    <div className={styles['container']}>
      {/*Link 버튼 수정예정 */}
      <Link href={`dashboard/${id}`}>&lt; 돌아가기</Link>
      <EditDashboardName />
      <EditMember />
      <EditInvitation />
      <Button buttonType='delete-dashboard'>대시보드 삭제하기</Button>
    </div>
  );
}

export default DashboardEdit;
