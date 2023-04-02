import { useContext, useEffect, useState } from 'react'
import {Context } from '../Gallery'
import axios from 'axios'
import {AdminpageContext} from '../pages/Adminpage'


const createCategory = async (baseUrl, newCategory,setNewCategory) => {
  const data = {category : newCategory }
  await axios.post(`${baseUrl}/createcategory`, data)
  .then((res)=>{
    setNewCategory('')
  })
}

const fetchCategoryList = async (baseUrl, setCategoryList) => {
  await axios.get(`${baseUrl}/getcategorylist`)
  .then((res)=>{
    setCategoryList(res.data)
  })
}

const deleteCategory = (baseUrl, id ) => {
  const data = { _id : id }
  axios.post(`${baseUrl}/deletecategory`, data)
}

const updateCategory = (baseUrl, id, newCategory) => {
  const data = { _id : id, category : newCategory }
  axios.post(`${baseUrl}/updatecategory`, data)
}

const preUpdatePrepare = (category,setNewCategory, setIsUpdate) => {
  setIsUpdate(true)
  setNewCategory(category)
}

const OneCategory = ({item, setNewCategory, setIsUpdate}) => {
  const {baseUrl} = useContext(Context)
  
  return <div class='flex'>
    <div class='bg-gray-400 m-2 p-4 rounded-lg w-2/6 flex justify-center'>{item.category}</div>
    <button onClick={()=>preUpdatePrepare(item.category,setNewCategory, setIsUpdate)}
    class='m-2 p-2 bg-green-400'>update</button>
    <button onClick={()=>deleteCategory(baseUrl, item._id)}
    class='m-2 p-2 bg-red-400'>delete</button>
  </div>
}

const updateNewCategory = (e, setNewCategory) => {
  const input = e.target.value
  setNewCategory(input)
}

export default function EditCategory() {
  const {baseUrl, categoryList, setCategoryList } = useContext(Context)
  const [newCategory, setNewCategory ] = useState('')
  const [isUpdate, setIsUpdate] = useState(false)
  
  return <div>
  <button onClick={()=>fetchCategoryList(baseUrl, setCategoryList)} class='m-2 p-2 bg-violet-400 '>fetch</button>
  <button onClick={()=>{
    setNewCategory('')
    setIsUpdate(false)
  }} class='m-2 p-2 bg-yellow-400 '>new</button>
  
  <hr/>
  
  <div>
  <input type='text' onChange={(e)=>updateNewCategory(e,setNewCategory)} value={newCategory} class='border-4 border-black p-2 m-2'/>
  
  {!isUpdate?
  <button onClick={()=>createCategory(baseUrl,newCategory,setNewCategory)} class='p-2 m-2 bg-pink-400 rounded'> create </button>
  :
  <button onClick={()=>updateCategory(baseUrl, item._id, newCategory)} class='p-2 m-2 bg-green-400 rounded'>update</button>
  }
  
  </div>
  
  {
    categoryList.map(item => <div>
      <OneCategory item={item} setNewCategory={setNewCategory} setIsUpdate={setIsUpdate}/>
    </div> )
  }
  
  </div>
}