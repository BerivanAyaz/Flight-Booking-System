import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, CircularProgress, Chip, Menu, MenuItem, Modal, IconButton } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CancelIcon from '@mui/icons-material/Cancel';
import FlightIcon from '@mui/icons-material/Flight';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import HeaderContainer from '../../components/headerContainer/HeaderContainer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const MyFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [selectedSort, setSelectedSort] = useState('Recommended');
  const [open, setOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [flightToCancel, setFlightToCancel] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/flights/bookings');
      const flightsWithPricing = response.data.map(flight => ({
        ...flight,
        prices: {
          main: 300,
          comfort: 345,
          deltaOne: 385
        }
      }));
      setFlights(flightsWithPricing);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('Failed to load flights. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCancelFlight = (flight) => {
    setFlightToCancel(flight);
    setCancelModalOpen(true);
  };

  const confirmCancelFlight = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/flights/cancel/${flightToCancel._id}`);
      setCancelModalOpen(false);
      fetchFlights(); // Refresh the flights list
    } catch (err) {
      console.error('Error cancelling flight:', err);
      setError('Failed to cancel flight. Please try again later.');
    }
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = (option) => {
    if (option) {
      setSelectedSort(option);
    }
    setSortAnchorEl(null);
  };

  const handleOpen = (flight) => {
    setSelectedFlight(flight);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f4f4f4', minHeight: '100vh' }}>
      <HeaderContainer />
      <Box sx={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SortIcon sx={{ color: '#2c7eae', marginRight: '8px' }} />
            <Typography
              variant="body1"
              sx={{
                color: '#2c7eae',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={handleSortClick}
            >
              Sort by: {selectedSort}
            </Typography>
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={() => handleSortClose()}
              PaperProps={{
                elevation: 2,
                sx: { borderRadius: '8px', marginTop: '8px' }
              }}
            >
              <MenuItem onClick={() => handleSortClose('Recommended')}>Recommended</MenuItem>
              <MenuItem onClick={() => handleSortClose('Cheapest price')}>Cheapest price</MenuItem>
              <MenuItem onClick={() => handleSortClose('Most expensive price')}>Most expensive price</MenuItem>
            </Menu>
          </Box>
          <Typography variant="body2" sx={{ color: '#2c7eae' }}>
            ⓘ Your Booked Flights
          </Typography>
        </Box>
        {flights.map((flight, index) => (
          <Card key={index} sx={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ padding: '20px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: '15px' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {flight.scheduleTime.slice(0, 5)}
                  </Typography>
                  <FlightIcon sx={{ mx: 2, transform: 'rotate(90deg)', color:'#2c7eae' }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {formatTime(flight.estimatedLandingTime)}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ marginBottom: '15px' }}>
                  Destination: {flight.route.destinations.join(' to ')}
                </Typography>
                <Chip label={flight.flightName} color="primary" sx={{ marginBottom: '15px' }} />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                {Object.entries(flight.prices).map(([type, price], idx) => (
                  <Box key={idx} sx={{ textAlign: 'center', minWidth: '80px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: idx === 1 ? '#2c7eae' : 'inherit' }}>${price}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<FlightTakeoffIcon />} 
                  sx={{ borderRadius: '20px', flex: 1 }}
                  onClick={() => handleOpen(flight)}
                >
                  Flight Details
                </Button>
                <Button 
                  variant="contained" 
                  color="error" 
                  startIcon={<CancelIcon />} 
                  sx={{ borderRadius: '20px', flex: 1}}
                  onClick={() => handleCancelFlight(flight)}
                >
                  Cancel Flight
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

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

      <Modal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        aria-labelledby="cancel-flight-modal"
        aria-describedby="cancel-flight-confirmation"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isSmallScreen ? '90%' : 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Are you sure you want to cancel your flight?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setCancelModalOpen(false)} sx={{ mr: 2 }}>
              No
            </Button>
            <Button variant="contained" color="error" onClick={confirmCancelFlight}>
              Yes, I'm sure
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MyFlights;