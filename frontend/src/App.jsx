import './App.css'

import {
  Routes,
  Route,
  BrowserRouter as Router
} from 'react-router-dom'
import LoginPage from './pages/LoginPage'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>

    </Router>

    </>
  )
}

export default App
