import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faCompass } from '@fortawesome/free-solid-svg-icons'; 
import Avatar from '@mui/material/Avatar';
import TopBarLogo from '../../assets/images/topBarLogo.png';
import ProfilePhoto from '../../assets/images/profilePhoto.jpg'; 
import styles from './TopBar.module.scss';

const TopBar = () => {
  return (
    <div className={styles.topbar}>
      <header>
        <div className={styles.topbar__left}>
          <Link to="/" className={styles['topbar__left-logo-container']}>
            <img src={TopBarLogo} alt="TopBar Logo" className={styles['topbar__left-logo']} />
            <span className={styles['topbar__left-title']}>Flight Booking</span>
          </Link>
        </div>

        <div className={styles.topbar__right}>
          <Link to="/" className={styles['topbar__right-link']} aria-label="Deals">
            <FontAwesomeIcon icon={faTags} className={styles['topbar__right-link-icon']} />
            <span className={styles['topbar__right-link-text']}>Deals</span>
          </Link>
          <Link to="/" className={styles['topbar__right-link']} aria-label="Discover">
            <FontAwesomeIcon icon={faCompass} className={styles['topbar__right-link-icon']} />
            <span className={styles['topbar__right-link-text']}>Discover</span>
          </Link>
          <div className={styles['topbar__right-avatar']}>
            <Avatar src={ProfilePhoto} alt="Daphne Hill" className={styles['topbar__right-avatar-photo']} />
            <span className={styles['topbar__right-avatar-name']}>Daphne Hill</span>
          </div>
        </div>
      </header>
    </div>
  );
};

export default TopBar;