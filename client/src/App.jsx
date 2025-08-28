import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
        <main className="container">
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <Login onLogin={login} />
                ) : (
                  <Navigate to="/tasks" replace />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                !isAuthenticated ? (
                  <Register onLogin={login} />
                ) : (
                  <Navigate to="/tasks" replace />
                )
              } 
            />
            <Route 
              path="/tasks" 
              element={
                isAuthenticated ? (
                  <TaskList />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/tasks/new" 
              element={
                isAuthenticated ? (
                  <TaskForm />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/tasks/edit/:id" 
              element={
                isAuthenticated ? (
                  <TaskForm />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Navigate to="/tasks" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
