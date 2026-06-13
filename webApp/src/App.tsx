
import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HistoryDashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Login from './pages/login';


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<HistoryDashboard/>} />
        </Routes>
      </Router>
  
  );
}

export default App
