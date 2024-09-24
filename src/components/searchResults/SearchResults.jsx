import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faPlaneArrival, faPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './SearchResults.module.scss';
import { ClipLoader } from 'react-spinners';
import { Modal, Box, Typography, IconButton, useMediaQuery, useTheme, Snackbar, Alert } from '@mui/material';  // Import Snackbar and Alert
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

const calculateDuration = (scheduleTime, estimatedLandingTime) => {
  const departureDate = new Date(`1970-01-01T${scheduleTime}`);
  let arrivalDate = new Date(`1970-01-01T${new Date(estimatedLandingTime).toTimeString().slice(0, 8)}`);

  if (arrivalDate < departureDate) {
    arrivalDate.setDate(arrivalDate.getDate() + 1);
  }

  const durationMs = arrivalDate - departureDate;
  const hours = Math.floor(durationMs / 3600000);
  const minutes = Math.floor((durationMs % 3600000) / 60000);

  return `${hours}h ${minutes}m`;
};

const SearchResults = ({ flights, loading, searchPerformed }) => {
  console.log("SearchResults:", flights);

  const [open, setOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [success, setSuccess] = useState(false); // New state for success notification
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar visibility
  const navigate = useNavigate(); 

  const handleOpen = (flight) => {
    setSelectedFlight(flight);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

 const handleBookFlight = async (flight) => {
    try {
      const bookingData = {
        ...flight,
        scheduleDateTime: new Date(flight.scheduleDateTime)
      };

      const response = await axios.post('http://localhost:5001/api/flights/book', bookingData);
      console.log('Booking successful:', response.data);

      setSuccess(true);
      setSnackbarOpen(true);

      // Set a timeout to redirect after the snackbar is shown
      setTimeout(() => {
        navigate('/myFlights'); // Redirect to MyFlights page
      }, 2000); // Wait for 2 seconds before redirecting
    } catch (error) {
      console.error('Error booking flight:', error);
      setSuccess(false);
      setSnackbarOpen(true);
    }
  };


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinnerWrapper}>
          <ClipLoader size={50} color={"#2c7eae"} loading={loading} />
          <FontAwesomeIcon icon={faPlane} className={styles.spinnerPlaneIcon} />
        </div>
      </div>
    );
  }

  if (searchPerformed && (!flights || flights.length === 0)) {
    return (
      <div className={styles.noFlightsMessage}>
        <p>Sorry, no flights were found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.searchResultsContainer}>
        {flights.map((flight, index) => {
          const duration = calculateDuration(flight.scheduleTime, flight.estimatedLandingTime);
          return (
            <div key={index} className={styles.searchResult}>
              <div className={styles.infoContainer}>
                <div className={styles.airportInfo}>
                  <h3>{flight.prefixICAO} - {flight.route.destinations[0]}</h3>
                </div>
                <div className={styles.flightDetails}>
                  <div className={styles.flightDetail}>
                    <div className={styles.iconContainer}>
                      <FontAwesomeIcon icon={faPlaneDeparture} className={styles.icon} />
                      <span className={styles.flightType}>Departure</span>
                    </div>
                    <div className={styles.time}>{flight.scheduleTime.slice(0, 5)}</div>
                    <div className={styles.airport}>Airport: </div>
                  </div>
                  <div className={styles.flightDuration}>
                    <div className={styles.airline}>{flight.airlineCode}</div>
                    <div className={styles.durationContainer}>
                      <hr className={styles.durationLine} />
                      <FontAwesomeIcon icon={faPlane} className={styles.planeIcon} />
                      <hr className={styles.durationLine} />
                    </div>
                    <div className={styles.duration}>{duration}</div>
                  </div>
                  <div className={styles.flightDetail}>
                    <div className={styles.iconContainer}>
                      <FontAwesomeIcon icon={faPlaneArrival} className={styles.icon} />
                      <span className={styles.flightType}>Arrival</span>
                    </div>
                    <div className={styles.time}>
                      {new Date(flight.estimatedLandingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className={styles.airport}>Airport: </div>
                  </div>
                </div>
                <div className={styles.priceContainer}>
                  <div className={styles.price}>Price: <span>300$</span></div>
                  <div className={styles.tripType}>{flight.flightDirection === 'A' ? 'Arrival' : 'Departure'}</div>
                </div>
                <div className={styles.buttonContainer}>
                  <button className={styles.detailsButton} onClick={() => handleOpen(flight)}>
                    Check the details
                  </button>
                  <button className={styles.bookButton} onClick={() => handleBookFlight(flight)}>
                    Book Flight
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="flight-details-modal"
        aria-describedby="flight-details-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isSmallScreen ? '90%' : 400,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: 'auto',
        }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          
          {selectedFlight && (
            <>
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, color: '#2c7eae' }}>
                Flight Details
              </Typography>
              
              <Typography variant="body1" paragraph>
                <strong>Flight Name:</strong> {selectedFlight.flightName || 'N/A'}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Flight Number:</strong> {selectedFlight.flightNumber || 'N/A'}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Flight ID:</strong> {selectedFlight.id || 'N/A'}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Airline Code:</strong> {selectedFlight.airlineCode || 'N/A'}
              </Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* Snackbar for booking success or failure */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000} // Reduced to 2000ms to match the redirect timeout
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={success ? "success" : "error"} sx={{ width: '100%', backgroundColor: '#d3ecfa'}}>
          {success ? "Flight booked successfully! Redirecting to My Flights..." : "Error booking flight. Please try again."}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SearchResults;
