import FixedMenu from '@/components/FixedMenu';
import DashboardList from './DashboardList/DashboardList';
import InvitedDashboard from './invitedDashboard/InvitedDashboard';
import styles from './MyDashboard.module.scss';
import DashboardLayout from '../dashboardLayout';
import { useTheme } from '@/hooks/useThemeContext';

function MyDashboard() {
  const { theme } = useTheme();
  const themeStyle = styles[`${theme}`];
  return (
    <DashboardLayout>
      <div className={`${styles['container']} ${themeStyle}`}>
        <FixedMenu />
        <DashboardList />
        <InvitedDashboard />
      </div>
    </DashboardLayout>
  );
}

export default MyDashboard;
