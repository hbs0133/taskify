import styles from './Chip.module.scss';
import { IconAddChip } from '@/assets/icongroup';
import { useTheme } from '@/hooks/useThemeContext';

function ChipAdd() {
  const { theme } = useTheme();
  return (
    <p className={`${styles['add']} ${styles[theme]}`}>
      <IconAddChip className={styles['add-icon']} />
    </p>
  );
}

export default ChipAdd;
