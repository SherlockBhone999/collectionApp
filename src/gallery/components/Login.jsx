import axios from 'axios'
import {useState, useContext} from 'react'
import {Context} from '../Gallery'
import {useNavigate} from 'react-router-dom'




////
const updateInput = (e, setInput) =>{
  const a = e.target.value
  setInput({password : a})
}

const submit = (e, baseUrl, input, setLoginBoxState, setIsAdmin, navigate) =>{
  e.preventDefault()
  axios.post(`${baseUrl}/login`, input )
  .then(res =>{
    if(res.data === 'yes'){
      setLoginBoxState('hidden')
      setIsAdmin('yes')
      navigate('/admin')
    }else{
      setIsAdmin('no')
    }
  })
}

const ResponseBox = ({isAdmin}) =>{
  if(isAdmin === 'no'){
    return <div>
    password not match, just enjoy guest mode.
    </div>
  }else if(isAdmin === ''){
    return <div>
    please type in password, only admin has permission to create, update and delete files.
    </div>
  }else return
}

export default function Login({setLoginBoxState}){
  const [input, setInput ] = useState('')
  const {baseUrl, isAdmin, setIsAdmin} = useContext(Context)
  const navigate = useNavigate()
  
  return <div class='text-white'>
  
  <ResponseBox isAdmin={isAdmin}/>
  
  <div>
    <input type='text' onChange={(e)=>updateInput(e,setInput)} class='text-black' />
  
    <button onClick={(e)=>submit(e,baseUrl,input, setLoginBoxState, setIsAdmin, navigate)}
    class='m-2 p-2 '>submit </button>
  </div>
  
  <div>
    <button onClick={()=>setLoginBoxState('hidden')} class='bg-blue-600 p-2 m-3 rounded fixed top-0 right-0'>back</button>
  </div>
  
  

  </div>
}