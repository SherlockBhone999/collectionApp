
import Gallery from '../components/Gallery'
import Login from '../components/Login'
import {useState, useContext} from 'react'
import {Context} from '../Gallery'
import { useNavigate } from 'react-router-dom'




export default function Homepage () {
  const [loginBoxState, setLoginBoxState] = useState('hidden')
  const {isAdmin} = useContext(Context)
  const navigate = useNavigate()

  return <div>
  {isAdmin !=='yes'?
  <div class=''>
    <button onClick={()=>{
      setLoginBoxState('')
    }}>login </button>
  </div>
  :
  <div>
    <button onClick={()=>{
      navigate('/admin')
    }}> admin page </button>
  </div>
  }
  
  <div class={`w-screen h-screen fixed flex justify-center items-center bg-black bg-opacity-80 ${loginBoxState}`}>
    <div class='mb-0'>
      <Login setLoginBoxState={setLoginBoxState} />
    </div>
  </div>
  
  
  
  <Gallery />
  
  </div>
}