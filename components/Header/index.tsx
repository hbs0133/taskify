import React from 'react';
import styles from './index.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import logoIcon from '@/assets/images/img_logo_icon.png';
import logoText from '@/assets/images/img_logo_text.png';

export default function Header({ mode = '' }) {
  return (
    <header className={`${styles['header-container']} ${styles[mode]}`}>
      <Link href='/'>
        <div className={`${styles['logo-container']}`}>
          <div className={`${styles['logo-icon-wrapper']}`}>
            <Image
              src={logoIcon}
              alt=''
              layout='fill'
              objectFit='cover'
              priority
            />
          </div>
          <div className={`${styles['logo-text-wrapper']}`}>
            <Image
              src={logoText}
              alt=''
              layout='fill'
              objectFit='cover'
              priority
            />
          </div>
        </div>
      </Link>
      <div className={`${styles['sign-container']}`}>
        <Link href='/signin'>
          <p>로그인</p>
        </Link>
        <Link href='/signup'>
          <p>회원가입</p>
        </Link>
      </div>
    </header>
  );
}
