import styles from './MemberListItem.module.scss';
import Image from 'next/image';
import profileImage from '@/assets/images/img_profileImg.png';
import Button from '@/components/Button';

function MemberListItem() {
  return (
    <div className={styles['container']}>
      <div className={styles['member-info']}>
        <Image
          src={profileImage}
          width={38}
          height={38}
          className={styles['member-profile-image']}
          alt='퍼블리싱을 위한 임시프로필 이미지'
        />
        <span className={styles['member-name']}>정만철</span>
      </div>
      <Button buttonType='delete'>삭제</Button>
    </div>
  );
}

export default MemberListItem;
