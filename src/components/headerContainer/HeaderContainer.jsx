import React from 'react';
import { Box, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import styles from '../../pages/MyFlightsPage/MyFlights.module.scss';

const HeaderContainer = () => {
  return (
    <Box className={styles.headerContainer}>
      {/* Options */}
      <Box className={styles.filterButtons}>
        <Button sx={{ backgroundColor: '#f3f5f6', color: '#2c7eae', '&:hover': { backgroundColor: '#d3ecfa' } }}>Times</Button>
        <Button sx={{ backgroundColor: '#f3f5f6', color: '#2c7eae', '&:hover': { backgroundColor: '#d3ecfa' } }}>Stops</Button>
        <Button sx={{ backgroundColor: '#f3f5f6', color: '#2c7eae', '&:hover': { backgroundColor: '#d3ecfa' } }}>Airlines</Button>
        <Button sx={{ backgroundColor: '#f3f5f6', color: '#2c7eae', '&:hover': { backgroundColor: '#d3ecfa' } }}>Airports</Button>
        <Button sx={{ backgroundColor: '#f3f5f6', color: '#2c7eae', '&:hover': { backgroundColor: '#d3ecfa' } }}>Amenities</Button>
      </Box>
      {/* Edit Search */}
      <Box className={styles.editSearch}>
        <Button variant="text">Edit Search ▼</Button>
      </Box>
      {/* Star Ratings */}
      <Box className={styles.starRatings}>
        <Box className={styles.starGroup}>
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starHalf} />
          <StarIcon className={styles.starEmpty} />
          <StarIcon className={styles.starEmpty} />
        </Box>
        <Box className={styles.starGroup}>
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starHalf} />
          <StarIcon className={styles.starEmpty} />
        </Box>
        <Box className={styles.starGroup}>
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starEmpty} />
        </Box>
        <Box className={styles.starGroup}>
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starFilled} />
          <StarIcon className={styles.starFilled} />
        </Box>
      </Box>
    </Box>
  );
};

export default HeaderContainer;