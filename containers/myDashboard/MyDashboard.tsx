import FixedMenu from '@/components/FixedMenu';
import DashboardList from './DashboardList/DashboardList';
import InvitedDashboard from './InvitedDashboard/InvitedDashboard';
import styles from './MyDashboard.module.scss';
import DashboardLayout from '../dashboardLayout';

function MyDashboard() {
  return (
    <DashboardLayout>
      <div className={styles['container']}>
        <FixedMenu />
        <DashboardList />
        <InvitedDashboard />
      </div>
    </DashboardLayout>
  );
}

export default MyDashboard;
