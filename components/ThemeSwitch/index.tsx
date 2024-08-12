import { useTheme } from '@/hooks/useThemeContext';
import { useState } from 'react';
import styles from './index.module.scss';

function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label htmlFor='switch' className={styles['switch']}>
      <input
        onClick={toggleTheme}
        id='switch'
        type='checkbox'
        checked={theme === 'light'}
      />
      <span className={styles['slider']}></span>
      <span className={styles['decoration']}></span>
    </label>
  );
}

export default ThemeSwitch;
