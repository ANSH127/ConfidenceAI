import './App.css'

import {
  Routes,
  Route,
  BrowserRouter as Router
} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ButtonAppBar from './components/ButtonAppBar'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'

function App() {

  return (
    <>
    <Router>
      <ButtonAppBar/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/' element={<DashboardPage/>}/>
      </Routes>

    </Router>

    </>
  )
}

export default App
