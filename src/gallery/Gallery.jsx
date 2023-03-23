
import { useState,useEffect, createContext, useContext } from 'react'
import {BrowserRouter, Route , Routes , useParams } from 'react-router-dom'
import axios from 'axios'
import Homepage from './pages/Homepage'
import Itempage from './pages/Itempage'
import Formpage from './pages/Formpage'

export const Context = createContext()

const App = () => {
  const {id} = useParams()
  return <BrowserRouter>
   <Routes>
    <Route exact path='/' element={<Homepage />}/>
    <Route path='/form' element={<Formpage />}/>
    <Route path='/:id' element={<Itempage />} />
   </Routes>
  </BrowserRouter>
}

const fetchData = async(setList,chosenCategory) => {
    await axios.get(`http://localhost:3000/`, {responseType : 'arraybuffer'})
    .then( res => {
      const array = res.data
      
      const base64 = btoa(
        new Uint8Array(array[0]).reduce(
          (data,byte) => data + String.fromCharCode(byte), '')
        )
      setList([base64])
      console.log(res)
    })
    
  }
  
export default function Gallery (){
  const [list, setList ] = useState([])
  const [ chosenCategory, setChosenCategory ] = useState('')
  const baseUrl = "http://localhost:3000"
  
  
  
  /*
  useEffect(()=>{
    fetchData(setList, chosenCategory)
  },[])
  */
  
  return <Context.Provider value={{ 
    list,
    setList,
    chosenCategory,
    setChosenCategory,
    baseUrl,
    
  }}>
    <App />
  </Context.Provider>
}