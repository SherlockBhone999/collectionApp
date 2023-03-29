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
  
  return <div>
    {item.category}
    <button onClick={()=>preUpdatePrepare(item.category,setNewCategory, setIsUpdate)}>update</button>
    <button onClick={()=>deleteCategory(baseUrl, item._id)}>delete</button>
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
  <button onClick={()=>fetchCategoryList(baseUrl, setCategoryList)}>fetch</button>
  <button onClick={()=>{
    setNewCategory('')
    setIsUpdate(false)
  }}>new</button>
  <div>
  <input type='text' onChange={(e)=>updateNewCategory(e,setNewCategory)} value={newCategory}/>
  
  {!isUpdate?
  <button onClick={()=>createCategory(baseUrl,newCategory,setNewCategory)}> create </button>
  :
  <button onClick={()=>updateCategory(baseUrl, item._id, newCategory)}>update</button>
  }
  
  </div>
  
  {
    categoryList.map(item => <div>
      <OneCategory item={item} setNewCategory={setNewCategory} setIsUpdate={setIsUpdate}/>
    </div> )
  }
  
  </div>
}