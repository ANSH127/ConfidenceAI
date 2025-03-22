import './App.css'

import {
  Routes,
  Route,
  BrowserRouter as Router
} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ButtonAppBar from './components/ButtonAppBar'
import SignUpPage from './pages/SignUpPage'

function App() {

  return (
    <>
    <Router>
      <ButtonAppBar/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage/>}/>
      </Routes>

    </Router>

    </>
  )
}

export default App
