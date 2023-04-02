
import Gallery from '../components/Gallery'
import Login from '../components/Login'
import {useState, useContext} from 'react'
import {Context} from '../Gallery'
import { useNavigate } from 'react-router-dom'




export default function Homepage () {
  const [loginBoxState, setLoginBoxState] = useState('hidden')
  const {isAdmin} = useContext(Context)
  const navigate = useNavigate()

  return <div class=''>
  {isAdmin !=='yes'?
  
    <div class='flex justify-end m-2'>
      <button onClick={()=>{
        setLoginBoxState('')
      }} class='bg-blue-400 p-2 m-1 rounded'>login </button>
    </div>
  
  :
  <div>
    <button onClick={()=>{
      navigate('/admin')
    }} class='bg-black p-2 m-2 text-white rounded'> admin-page </button>
  </div>
  }
  
  <Gallery />
  
  <div class={`w-screen h-screen fixed top-0 flex bg-black bg-opacity-80 ${loginBoxState}`}>
    <div class='fixed top-20 left-10'>
      <Login setLoginBoxState={setLoginBoxState} />
    </div>
  </div>
  
  </div>
}