import DashboardList from './DashboardList/DashboardList';
import InvitedDashboard from './invitedDashboard/InvitedDashboard';
import styles from './MyDashboard.module.scss';

function MyDashboard() {
  return (
    <div className={styles['container']}>
      <DashboardList />
      <InvitedDashboard />
    </div>
  );
}

export default MyDashboard;
