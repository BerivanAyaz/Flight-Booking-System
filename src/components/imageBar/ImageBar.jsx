import React from 'react';
import styles from './ImageBar.module.scss';
import TravelPhoto from '../../assets/images/travel.jpg';
import SummerFavorites from '../../assets/images/SummerFavorites.jpg';
import AdvantagedTransfers from '../../assets/images/AdvantagedTransfers.jpg';

const ImageBar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.imageContainer}>
        <img src={TravelPhoto} alt="Travel Opportunities" />
        <div className={styles.imageText}>TRAVEL OPPORTUNITIES</div>
      </div>
      <div className={styles.imageContainer}>
        <img src={SummerFavorites} alt="Summer Favorites" />
        <div className={styles.imageText}>SUMMER FAVORITES</div>
      </div>
      <div className={styles.imageContainer}>
        <img src={AdvantagedTransfers} alt="Advantaged Transfers" />
        <div className={styles.imageText}>ADVANTAGED TRANSFERS</div>
      </div>
    </div>
  );
};

export default ImageBar;