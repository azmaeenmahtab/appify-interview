import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Feed from './pages/feed';
import Login from './auth/login';
import Register from './auth/register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App
