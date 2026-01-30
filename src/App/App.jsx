import Login from '../Pages/Login/Login'
import Register from '../Pages/Register/Register'
import './App.css'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'

function App() { 

  return (
    <div>  
      <Routes>   
        <Route path='/login' element = {<Login/>} />         {/* url ekee "/login" meeka gahuwoth ookata yanawa */}
        <Route path='/register' element = {<Register/>} /> 
      </Routes>
    </div>
  )
}

export default App
