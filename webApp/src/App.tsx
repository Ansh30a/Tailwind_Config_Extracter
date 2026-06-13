import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const isLoggedIn = () => !!localStorage.getItem('token');

// Wraps routes that require auth — redirects to landing if not logged in
const PrivateLayout = () => {
  if (!isLoggedIn()) return <Navigate to="/" replace />;
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

// Redirects logged-in users away from auth pages
const PublicRoute = ({ element }: { element: React.ReactElement }) => {
  if (isLoggedIn()) return <Navigate to="/home" replace />;
  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicRoute element={<Landing />} />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/signup" element={<PublicRoute element={<Signup />} />} />

        {/* Private — with sidebar */}
        <Route element={<PrivateLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
