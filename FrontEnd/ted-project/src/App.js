import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Layout from './Layout';
import Admin from './admin/Admin';
import User from './user/User';
import UserDetail from './admin/UserDetail'; // Εισαγωγή του UserDetail component
import { UserProvider } from './UserContext';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="admin" element={<Admin />} />
            <Route path="user" element={<User />} />
            <Route path="user/:userId" element={<UserDetail />} /> {/* Διαδρομή για UserDetail */}
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
