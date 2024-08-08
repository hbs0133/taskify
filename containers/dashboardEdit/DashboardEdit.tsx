import Link from 'next/link';
import styles from './DashboardEdit.module.scss';
import EditDashboardName from './EditDashboardName/EditDashboardName';
import EditInvitation from './EditInvitation/EditInvitation';
import EditMember from './EditMember/EditMember';
import Button from '@/components/Button';
import { useRouter } from 'next/router';

function DashboardEdit() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className={styles['container']}>
      <Link href={`dashboard/${id}`}>&lt; 돌아가기</Link>
      <EditDashboardName id={id} />
      <EditMember id={id} />
      <EditInvitation id={id} />
      <Button buttonType='delete-dashboard'>대시보드 삭제하기</Button>
    </div>
  );
}

export default DashboardEdit;
