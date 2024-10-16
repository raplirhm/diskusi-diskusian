import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PostList from './components/PostList';
import Profile from './components/Profile';
import UserPosts from './components/UserPosts';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className=''>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
          <Route path="/" element={user ? <PostList user={user} onLogout={handleLogout} /> : (
            <div className='flex flex-col items-center justify-center min-h-screen gap-5'>
              <h2 className='text-5xl'>Welcome to Diskusi(?)</h2>
              <div className='flex gap-1'>
                <p>Please </p>
                <Link to="/login" className='transition-colors duration-300 hover:text-white'>login</Link>
                <p>or </p>
                <Link to="/register" className='transition-colors duration-300 hover:text-white'>register</Link>
              </div>
            </div>
          )} />
          <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
          <Route path="/user/:username/posts" element={<UserPosts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
