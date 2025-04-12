import './App.css'

import {
  Routes,
  Route,
  BrowserRouter as Router
} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import ChatPage from './pages/ChatPage'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/' element={<DashboardPage/>}/>
        <Route path='/c/:id' element={<ChatPage/>}/>
      </Routes>

    </Router>

    </>
  )
}

export default App
