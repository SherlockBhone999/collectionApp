
import { useState,useEffect, createContext, useContext } from 'react'
import {BrowserRouter, Route , Routes , useParams } from 'react-router-dom'
import axios from 'axios'
import Homepage from './pages/Homepage'
import Itempage from './pages/Itempage'
import Adminpage from './pages/Adminpage'

export const Context = createContext()

const App = () => {
  const {id} = useParams()
  return <BrowserRouter>
   <Routes>
    <Route exact path='/' element={<Homepage />}/>
    <Route path='/admin' element={<Adminpage />}/>
    <Route path='/:id' element={<Itempage />} />
   </Routes>
  </BrowserRouter>
}

  
export default function Gallery (){
  const [list, setList ] = useState([])
  const [ chosenCategory, setChosenCategory ] = useState('all')
  //const baseUrl = "http://localhost:3000"
  const baseUrl = "https://bhone-n-collection.glitch.me"
  const [ isAdmin, setIsAdmin ] = useState('')
  const [categoryList, setCategoryList ] = useState([])
  const [itemForItempage, setItemForItempage] = useState({})


  return <Context.Provider value={{ 
    list,
    setList,
    chosenCategory,
    setChosenCategory,
    baseUrl,
    isAdmin,
    setIsAdmin,
    categoryList,
    setCategoryList,
    itemForItempage,
    setItemForItempage
    
  }}>
    <App />
  </Context.Provider>
}