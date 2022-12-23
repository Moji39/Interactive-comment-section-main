import React from 'react'
import './App.css';
import { BrowserRouter as Router, Routes, Route, Redirect } from "react-router-dom";
import LoginPage from './pages/login/LoginPage'
import CommentsPage from './pages/comments/CommentsPage';
import ErrorPage from './pages/error404/ErrorPage';
import { AuthProvider } from './contextes/AuthContext';
import AuthPrivateRoute from './utils/AuthPrivateRoute';

function App() {
  return (
    <div className="container">
      <Router> 
        <AuthProvider>
          <Routes>
            <Route path="/" element={<CommentsPage />} />
            <Route path="/login" element={<AuthPrivateRoute><LoginPage /></AuthPrivateRoute>} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
