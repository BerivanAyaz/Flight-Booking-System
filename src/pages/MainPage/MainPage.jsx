
import React, { useState, useEffect } from 'react';
import TopBar from "../../components/topBar/TopBar";
import FlightBook from "../../components/flightBook/FlightBook";
import SearchResults from "../../components/searchResults/SearchResults";
import FilterOptions from "../../components/filterOptions/FilterOptions";
import ImageBar from "../../components/imageBar/ImageBar";
import styles from './MainPage.module.scss';
import axios from 'axios';

const MainPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [searchPerformed, setSearchPerformed] = useState(false); // Add searchPerformed state

  useEffect(() => {
    const fetchAllFlights = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get("http://localhost:5001/api/flights");
        setSearchResults(response.data.flights || []);
      } catch (error) {
        console.error("Error fetching all flights:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchAllFlights();
  }, []);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <div className={styles.mainPage}>
      <TopBar />
      <div className={styles.content}>
        <div className={styles.mainContainer}>
          <div className={styles.flightBook}>
            <FlightBook 
              onSearchResults={handleSearchResults} 
              onLoadingChange={handleLoadingChange} // Pass loading handler
              onSearchPerformed={setSearchPerformed} // Pass searchPerformed handler
            />
          </div>
          <div className={styles.flightSearch}>
            <div className={styles.searchResultsContainer}>
              <SearchResults 
                flights={searchResults} 
                loading={loading} // Pass loading state
                searchPerformed={searchPerformed} // Pass searchPerformed state
              />
            </div>
            <div className={styles.filterOptionsContainer}>
              <FilterOptions />
            </div>
          </div>
        </div>
        <div className={styles.imageBarContainer}>
          <ImageBar />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
