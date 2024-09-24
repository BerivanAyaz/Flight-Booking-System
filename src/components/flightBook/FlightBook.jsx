import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faPlaneArrival, faPlane, faCalendar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import { tr } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './FlightBook.module.scss';
import axios from 'axios';

const FlightBook = ({ onSearchResults, onLoadingChange, onSearchPerformed }) => {
  const [tripType, setTripType] = useState('roundTrip');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  
  const inputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState('100%');

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(`${inputRef.current.offsetWidth}px`);
    }
  }, []);

  // Validate departure, arrival, and date fields
  const validateInputs = () => {
    const missingFields = [];
    if (!departure) missingFields.push("Departure place");
    if (!arrival) missingFields.push("Arrival place");
    if (!departureDate) missingFields.push("Departure date");
    if (tripType === 'roundTrip' && !returnDate) missingFields.push("Return date");
    return missingFields;
  };

  const handleSearch = async () => {
    const missingFields = validateInputs();
    if (missingFields.length > 0) {
      toast.error(`Please fill in the following fields: ${missingFields.join(', ')}`, {
        position: "top-right", 
        autoClose: 5000,
      });
      return;
    }

    if (onSearchPerformed) onSearchPerformed(true); 
    if (onLoadingChange) onLoadingChange(true); 
  
    try {
      // Fetch flights, but do not filter by date fields
      console.log("Search params:", { departure, arrival });
      const response = await axios.get("http://localhost:5001/api/flights", {
        params: {
          direction: 'A' 
        },
      });
      
      const flights = response.data.flights || [];
      
      // Only filter by departure and arrival
      const filteredFlights = flights.filter(flight => {
        const matchesDeparture = flight.prefixICAO.includes(departure);
        const matchesArrival = flight.route.destinations[0].includes(arrival);
  
        return matchesDeparture && matchesArrival;
      });
      
      onSearchResults(filteredFlights);
    } catch (error) {
      console.error('Error fetching flight data:', error.response ? error.response.data : error.message);
    } finally {
      if (onLoadingChange) onLoadingChange(false); // End loading
    }
  };

  const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className={styles.inputWrapper} style={{ width: inputWidth }}>
      <input
        value={value}
        onClick={onClick}
        readOnly
        placeholder={placeholder}
        className={styles.input}
        ref={ref}
      />
      <FontAwesomeIcon icon={faCalendar} className={styles.calendarIcon} onClick={onClick} />
    </div>
  ));

  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div className={styles.customHeader}>
      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <span>{date.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}</span>
      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );

  return (
    <div className={styles.flightBook}>
      <ToastContainer /> {/* This is needed to show the toast notifications */}
      <h2 className={styles.title}>
        <div className={styles.animatedPlane}>
          <FontAwesomeIcon icon={faPlane} />
        </div>
        BOOK YOUR FLIGHT
      </h2>
      <div className={styles.formContainer}>
        <div className={styles.tripTypeToggle}>
          <button
            className={`${styles.toggleButton} ${tripType === 'roundTrip' ? styles.active : ''}`}
            onClick={() => setTripType('roundTrip')}
          >
            Round trip
          </button>
          <button
            className={`${styles.toggleButton} ${tripType === 'oneWay' ? styles.active : ''}`}
            onClick={() => setTripType('oneWay')}
          >
            One way
          </button>
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper} ref={inputRef}>
            <FontAwesomeIcon icon={faPlaneDeparture} className={styles.planeIcon} />
            <input
              type="text"
              placeholder="Departure Place Code"
              className={styles.input}
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          </div>
          <div className={styles.inputWrapper}>
            <FontAwesomeIcon icon={faPlaneArrival} className={styles.planeIcon} />
            <input
              type="text"
              placeholder="Destination Place Code"
              className={styles.input}
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
            />
          </div>
          <div className={styles.datePickerContainer}>
            <DatePicker
              selected={departureDate}
              onChange={(date) => setDepartureDate(date)}
              minDate={new Date()}
              locale={tr}
              dateFormat="dd MMMM yyyy"
              placeholderText="Departure Date"
              customInput={<CustomInput />}
              popperClassName={styles.datePickerPopper}
              popperPlacement="bottom-start"
              renderCustomHeader={CustomHeader}
              calendarClassName={styles.customCalendar}
              dayClassName={() => styles.customDay}
            />
          </div>
          {tripType === 'roundTrip' && (
            <div className={styles.datePickerContainer}>
              <DatePicker
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                minDate={departureDate || new Date()}
                locale={tr}
                dateFormat="dd MMMM yyyy"
                placeholderText="Return Date"
                customInput={<CustomInput />}
                popperClassName={styles.datePickerPopper}
                popperPlacement="bottom-start"
                renderCustomHeader={CustomHeader}
                calendarClassName={styles.customCalendar}
                dayClassName={() => styles.customDay}
              />
            </div>
          )}
        </div>
        <button className={styles.searchButton} onClick={handleSearch}>Search Flights</button>
      </div>
    </div>
  );
};

export default FlightBook;
