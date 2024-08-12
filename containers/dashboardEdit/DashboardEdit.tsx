import Link from 'next/link';
import styles from './DashboardEdit.module.scss';
import EditDashboardName from './EditDashboardName/EditDashboardName';
import EditInvitation from './EditInvitation/EditInvitation';
import EditMember from './EditMember/EditMember';
import Button from '@/components/Button';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/services/axios';
import DashboardLayout from '../dashboardLayout';
import { IconArrowForward } from '@/assets/icongroup';
import useToast from '@/hooks/useToast';
import { useTheme } from '@/hooks/useThemeContext';

function DashboardEdit() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const themeStyle = styles[`${theme}`];

  const deleteDashboardMutation = useMutation({
    mutationFn: () => instance.delete(`/dashboards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
      toast('success', '대시보드를 성공적으로 삭제했습니다.');
    },
    onError: (err) => {
      toast('error', `${err.response.data.message}`);
    },
  });

  const handleDeleteClick = () => {
    deleteDashboardMutation.mutate();
    router.push('/mydashboard');
  };

  return (
    <DashboardLayout>
      <div className={`${styles['container']} ${themeStyle}`}>
        <Link href={`/dashboard/${id}`} className={styles['link']}>
          <IconArrowForward />
          돌아가기
        </Link>
        <EditDashboardName id={id} />
        <EditMember id={id} />
        <EditInvitation id={id} />
        <div className={styles['delete-button-wrapper']}>
          <Button onClick={handleDeleteClick} buttonType='delete-dashboard'>
            대시보드 삭제하기
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardEdit;
