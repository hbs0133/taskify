import Link from 'next/link';
import styles from './DashboardEdit.module.scss';
import EditDashboardName from './EditDashboardName/EditDashboardName';
import EditInvitation from './EditInvitation/EditInvitation';
import EditMember from './EditMember/EditMember';
import Button from '@/components/Button';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/services/axios';

function DashboardEdit() {
  const router = useRouter();
  const { id } = router.query;

  const queryClient = useQueryClient();
  const deleteDashboardMutation = useMutation({
    mutationFn: () => instance.delete(`/dashboards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dashboards'],
      });
    },
    onError: (error) => {
      console.error('Error deleting invitation:', error);
    },
  });

  const handleDeleteClick = () => {
    deleteDashboardMutation.mutate();
    router.push('/mydashboard');
  };

  return (
    <div className={styles['container']}>
      <Link href={`/dashboard/${id}`}>&lt;돌아가기</Link>
      <EditDashboardName id={id} />
      <EditMember id={id} />
      <EditInvitation id={id} />
      <Button onClick={handleDeleteClick} buttonType='delete-dashboard'>
        대시보드 삭제하기
      </Button>
    </div>
  );
}

export default DashboardEdit;
