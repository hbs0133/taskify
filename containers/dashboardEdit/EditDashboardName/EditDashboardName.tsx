import Button from '@/components/Button';
import styles from './EditDashboardName.module.scss';
import classNames from 'classnames';

function EditDashboardName() {
  return (
    <div className={styles['container']}>
      <h2 className={styles['section-header-title']}>비브리지</h2>
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
