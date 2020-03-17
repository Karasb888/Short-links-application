import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Loader } from './components/Loader'
import { AuthContext } from './context/AuthContext'
import { useRoutes } from './routes'
import { Navbar } from './components/Navbar'
import { useAuth } from './hooks/auth.hook'
import 'materialize-css'

function App() {
  const { login, logout, token, userId, ready } = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if(!ready) {
    return <Loader />
  }

  return (
    <AuthContext.Provider
      value={{ token, login, logout, userId, isAuthenticated }}
    >
      <Router>
        { isAuthenticated && <Navbar /> }
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App
