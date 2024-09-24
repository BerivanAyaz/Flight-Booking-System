import './App.css';
import MainPage from './pages/MainPage/MainPage'; 
import MyFlightsPage from './pages/MyFlightsPage/MyFlights'; 
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />        
        <Route path="/myFlights" element={<MyFlightsPage />} /> 
      </Routes>
    </div>
  );
}

export default App;
