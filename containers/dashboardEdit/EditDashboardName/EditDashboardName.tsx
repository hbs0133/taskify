import Button from '@/components/Button';
import styles from './EditDashboardName.module.scss';
import classNames from 'classnames';
import instance from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import InviteModal from '@/containers/myDashboard/InviteModal';

function EditDashboardName({ id }: { id: string | string[] | undefined }) {
  const fetchDashboardById = async (id: string | string[] | undefined) => {
    const response = await instance.get(`/dashboards/${id}`);
    return response.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['dashboard', id],
    queryFn: () => fetchDashboardById(id),
    enabled: !!id,
  });

  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles['container']}>
      <h2 className={styles['section-header-title']}>{data?.title}</h2>
      <div className={styles['dashboard-edit']}>
        <label>대시보드 이름</label>
        <input className={styles['dashboard-edit-name-input']} type='text' />
        <div className={styles['dashboard-edit-color']}>
          <button
            className={classNames(styles['circle'], styles['green'])}
          ></button>
          <button
            className={classNames(styles['circle'], styles['purple'])}
          ></button>
          <button
            className={classNames(styles['circle'], styles['orange'])}
          ></button>
          <button
            className={classNames(styles['circle'], styles['blue'])}
          ></button>
          <button
            className={classNames(styles['circle'], styles['pink'])}
          ></button>
        </div>
      </div>
      <Button buttonType='login'>변경</Button>
    </div>
  );
}

export default EditDashboardName;
