import React from 'react';
import styles from './FilterOptions.module.scss';

const FilterOptions = () => {
  return (
    <div className={styles.filterOptions}>
      <h3 className={styles.title}>Refine your search</h3>
      
      <div className={styles.section}>
        <h4>Sort by</h4>
        <select className={styles.select}>
          <option value="lowest">Lowest Price</option>
          <option value="highest">Highest Price</option>
          <option value="duration">Shortest Duration</option>
        </select>
      </div>
      
      <div className={styles.section}>
        <h4>Arrival Time</h4>
        <input type="range" min="0" max="24" defaultValue="12" className={styles.slider} />
        <div className={styles.sliderLabels}>
          <span>12 AM</span>
          <span>12 PM</span>
        </div>
      </div>
      
      <div className={styles.section}>
        <h4>Stops</h4>
        {['Nonstop', '1 Stop', '2+ Stops'].map((stop) => (
          <label key={stop} className={styles.checkboxLabel}>
            <input type="checkbox" />
            <span>{stop}</span>
            <span className={styles.price}>$230</span>
          </label>
        ))}
      </div>
      
      <div className={styles.section}>
        <h4>Airlines</h4>
        {['Alitalia', 'Lufthansa', 'Air France', 'Brussels Airlines', 'Air Italy', 'Siberia'].map((airline, index) => (
          <label key={airline} className={styles.checkboxLabel}>
            <input type="checkbox" disabled={index === 5} />
            <span className={index === 5 ? styles.disabled : ''}>{airline}</span>
            <span className={`${styles.price} ${index === 5 ? styles.disabled : ''}`}>$230</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterOptions;