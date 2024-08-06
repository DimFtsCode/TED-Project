// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import RegisterBio from './RegisterBio';
import Layout from './Layout';
import Admin from './admin/Admin';
import User from './user/User';
import UserSettings from './user/UserSettings';
import UserProfile from './user/UserProfile';
import UserNetwork from './user/UserNetwork';
import UserNotifications from './user/UserNotifications';
import Header from './Header';
import Footer from './Footer';
import { UserProvider } from './UserContext';
import ProtectedRoute from './ProtectedRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import UserDetail from './admin/UserDetail';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-fill">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route path="register-bio" element={<ProtectedRoute><RegisterBio /></ProtectedRoute>} />
                <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
                <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/user/network" element={<ProtectedRoute><UserNetwork /></ProtectedRoute>} />
                <Route path="/user/:userId" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
                <Route path="/user/settings" element={<ProtectedRoute><UserSettings/></ProtectedRoute>} />
                <Route path="/user/notifications" element={<ProtectedRoute><UserNotifications/></ProtectedRoute>} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
