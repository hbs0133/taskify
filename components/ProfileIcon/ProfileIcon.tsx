import Image from 'next/image';
import styles from './ProfileIcon.module.scss';
import getBackgroundColor from '@/utils/getBackgroundColor';
import { useTheme } from '@/hooks/useThemeContext';
import classNames from 'classNames';

interface ProfileIconProps {
  nickname: string;
  imageUrl: string | null;
  compressRemain?: boolean;
}

export function ProfileIcon({
  nickname,
  imageUrl,
  compressRemain = false,
}: ProfileIconProps) {
  const backColor = getBackgroundColor(nickname);
  const name = compressRemain ? nickname : nickname.substring(0, 1);
  const { theme } = useTheme();

  if (imageUrl)
    return (
      <div className={classNames(styles['profile-img'], styles[theme])}>
        <Image src={imageUrl} alt='프로필' fill className={styles['image']} />
      </div>
    );

  return (
    <div
      style={{ backgroundColor: backColor }}
      className={classNames(styles['profile-img'], styles[theme])}
    >
      <p className={styles['substring']}>{name}</p>
    </div>
  );
}
