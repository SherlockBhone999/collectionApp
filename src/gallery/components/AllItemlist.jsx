import { useContext, useEffect, useState } from 'react'
import {Context } from '../Gallery'
import axios from 'axios'
import {AdminpageContext} from '../pages/Adminpage'


const fetchListFromGdrive = async (setList,baseUrl) =>{
  await axios.get(`${baseUrl}/allgdrivelist`)
  .then(res => {
    setList(res.data)
  })
}



const fetchItemFromDB = async (id, name,setItemList,baseUrl) => {
  
  axios.post(`${baseUrl}/fetchitemfromdb`, { gdriveId : id } )
  .then((res)=>{
    const resItem = res.data
    setItemList( prevv => {
      const arr = [...prevv]
      for(let i=0; i< arr.length; i++){
        if(arr[i].id === id ){
          const newItem = {...resItem, ...arr[i]}
          arr[i] = newItem
        }
      }
      return arr
    })
  })
} 



const deleteItem = (_id,profileImgLink,baseUrl) => {
  const data = {_id : _id, profileImgLink : profileImgLink}
  axios.post(`${baseUrl}/delete`, data)
}

const updateItem = (setChosenComponent, setFormInitialData, item, setPreviewImg,baseUrl,setIsUpdateMode) => {
  setChosenComponent('form')
  setFormInitialData(item)
  setIsUpdateMode(true)
  fetchImg(item, setPreviewImg, baseUrl)
}


const fetchImg = async (item, setImg,baseUrl) => {
  const data = { name : item.name , id : item.profileImgLink }
  
  await axios.post(`${baseUrl}/fetchimgfromgdrive`, data, {responseType : "arraybuffer"})
  .then( res => {
      const data = res.data
      
      const base64 = btoa(
        new Uint8Array(data).reduce(
          (dataa,byte) => dataa + String.fromCharCode(byte), '')
        )
      
      setImg(base64)
      
    })
}

const createCategoryTest = async () => {
  const data = {category : 'anime' }
  await axios.post('http://localhost:3000/createcategory', data)
  .then((res)=>{
  
  })
}

const fetchCategoryList = async (baseUrl, setCategoryList) => {
  await axios.get(`${baseUrl}/getcategorylist`)
  .then((res)=>{
    setCategoryList(res.data)
  })
}



const sortItemList = (itemList, categoryList, setSortedList) => {
  const array = []
  
  categoryList.map((item)=>{
    const subarray = []
    itemList.map((itemm)=>{
      if(itemm.category === item.category){
        subarray.push(itemm)
      }
    })
    array.push(subarray)
  })
  setSortedList(array)
}
 
 
const OneItem = ({item}) => {
  const [buttonStyle, setButtonStyle] = useState('hidden')
  const {baseUrl, categoryList } = useContext(Context)
  const {setChosenComponent, setFormInitialData, setPreviewImg, setIsUpdateMode, itemList, setItemList, showUpdateButton, setShowUpdateButton } = useContext(AdminpageContext)
  
  useEffect(()=>{
    if(item._id){ setButtonStyle('') }
  },[item])
  
  return <div>
      <p>
      <span>{item.name}</span>  
      <span> {item._id}</span>
      
      <button class={`ml-2 bg-blue-400 rounded-lg p-1 text-white ${buttonStyle}`}
      onClick={()=>updateItem(setChosenComponent,setFormInitialData, item, setPreviewImg, baseUrl, setIsUpdateMode) } 
      >u </button>
      <button class={`ml-2 bg-red-400 rounded-lg p-1 text-white ${buttonStyle}`} onClick={()=>deleteItem(item._id, item.profileImgLink,baseUrl)}>d </button>
      </p>
  </div>
}


export default function AllItemlist(){
  
  const {baseUrl, categoryList , setCategoryList } = useContext(Context)
  const {itemList, setItemList } = useContext(AdminpageContext)
  const [sortedList, setSortedList ] = useState([])
  
  return <div>
  
  {
    categoryList.map(itemm => <div>
      {itemm.category}
    </div>)
  }
  
  <div >
  {
    itemList.map(item => <div>
      <OneItem item={item} />
    </div>)
  }
  </div>
  
  <hr/>
  
  <button onClick={()=>{
    if(categoryList.length === 0){
      fetchCategoryList(baseUrl, setCategoryList)
    }
  }}> get category list </button>
  
  <div>
  <button onClick={()=>fetchListFromGdrive(setItemList,baseUrl)}> fetch all items from gdrive</button>
  </div>
  
  <div>
  <button onClick={()=>{
    itemList.map((item)=>{
      fetchItemFromDB(item.id, item.name, setItemList, baseUrl)
    })
  }}> fetch corresponding items from database </button>
  </div>
  
  
  <b/>
  <button onClick={()=>{
    sortItemList(itemList, categoryList, setSortedList)
  }}> sort itemlist </button>
  
  <div class='bg-gray-200 p-2 m-1'>
  {
    sortedList.map(arr => <div>
     <p>{ arr[0].category} {arr.length}</p>
     <div class='bg-blue-200 p-1 grid'>
       {
         arr.map(item=> <div>
          {item.name}
         </div>)
       }
     </div>
    </div>)
  }
  </div>
  
  </div>
}



