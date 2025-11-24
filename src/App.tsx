import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Feed from './pages/feed';
import Login from './auth/login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </Router>
  );
}

export default App
