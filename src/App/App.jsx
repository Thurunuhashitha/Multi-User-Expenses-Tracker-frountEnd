import Login from '../Pages/Login/Login'
import Register from '../Pages/Register/Register'
import './App.css'
import Expenses from '../Pages/Expenses/Expenses'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'

function App() { 

  return (
    <div>  
      <Routes>   
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path='/login' element = {<Login/>} />         {/* url ekee "/login" meeka gahuwoth ookata yanawa */}
        <Route path='/register' element = {<Register/>} /> 
        <Route path='/expenses' element = {<Expenses/>} /> 
      </Routes>
    </div>
  )
}

export default App
