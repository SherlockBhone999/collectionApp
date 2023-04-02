import { useContext, useEffect, useState } from 'react'
import {Context } from '../Gallery'
import axios from 'axios'
import {AdminpageContext} from '../pages/Adminpage'


const fetchList = async (setItemList, baseUrl) =>{
  await axios.get(`${baseUrl}/fetchallitemdatafromdb` )
  .then(res => {
    setItemList(res.data)
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
  
  await axios.post(`${baseUrl}/fetchimgfrombackend`, data, {responseType : "arraybuffer"})
  .then( res => {
      const data = res.data
      
      const base64 = btoa(
        new Uint8Array(data).reduce(
          (dataa,byte) => dataa + String.fromCharCode(byte), '')
        )
      
      setImg(base64)
      
    })
}


const fetchCategoryList = async (baseUrl, setCategoryList) => {
  await axios.get(`${baseUrl}/getcategorylist`)
  .then((res)=>{
    setCategoryList(res.data)
  })
}




 
 
const OneItem = ({item}) => {
  const [style, setStyle] = useState('bg-blue-200')
  const {baseUrl, categoryList } = useContext(Context)
  const {setChosenComponent, setFormInitialData, setPreviewImg, setIsUpdateMode, itemList, setItemList, showUpdateButton, setShowUpdateButton } = useContext(AdminpageContext)
  const [buttonStyle, setButtonStyle ] = useState('hidden')

  
  useEffect(()=>{
    if(item._id){ setStyle('bg-green-400') }
  },[item])
  
  return <div class=''>
      <div class={`${style} p-2 m-1 overflow-hidden rounded`}>
      <button onClick={()=>{
        if(buttonStyle === 'hidden'){ 
          setButtonStyle('')
          setTimeout(()=>{
            setButtonStyle('hidden')
          },2000)
        }
      }}> {item.name} </button>
      
      <button class={`m-1 bg-blue-400 rounded-lg p-1 text-white ${buttonStyle}`}
      onClick={()=>updateItem(setChosenComponent,setFormInitialData, item, setPreviewImg, baseUrl, setIsUpdateMode) } 
      >u </button>
      <button class={`m-1 bg-red-400 rounded-lg p-1 text-white ${buttonStyle}`} onClick={()=>deleteItem(item._id, item.profileImgLink,baseUrl)}>d </button>
      
      </div>
  </div>
}

const OneCategory = ({item, setSelectedCategory, itemList, categoryList}) => {
  const handleClick = () =>{
    if(itemList[0]._id !== ''){
      setSelectedCategory(item.category)
    }
  }
  
  return <div class='m-1 p-2 bg-blue-200 rounded'>
    <button onClick={handleClick}>{item.category}</button>
  </div>
}



const FilteredList = ({selectedCategory, itemList}) => {
  const [filteredArray, setFilteredArray ] = useState([])
  
  useEffect(()=>{
    const array = [...itemList]
    const newArray = array.filter(item => item.category === selectedCategory)
    setFilteredArray(newArray)
  },[selectedCategory])
  
  
  return <div>
  {selectedCategory?
  <div> found {filteredArray.length} items in {selectedCategory} </div>
  : null
  }
  {
    filteredArray.map(item => <div>
      <OneItem item={item} />
    </div>)
  }
  </div>
}


const Table = ({categoryList, itemList, setSelectedCategory, selectedCategory}) => {
  
  return <div>
      <div class=''>
        <p>found {categoryList.length} categories : </p>
        <div class='flex'>
          <button onClick={()=>setSelectedCategory('')} class='m-1 p-2 bg-blue-200 rounded'>all</button>
          {categoryList.map(item => <div>
            <OneCategory item={item} 
            setSelectedCategory={setSelectedCategory}
            itemList={itemList}
            categoryList={categoryList}/>
          </div>)}
        </div>
      </div>
  
      {  itemList.length !== 0 && selectedCategory==='' ?
      <div>
        <p>found {itemList.length} items :</p>
        <div class='grid grid-cols-5 '>
          {itemList.map(item => <div>
            <OneItem item={item} />
          </div>)}
        </div>
      </div>
      : null
      }
  
      <FilteredList selectedCategory={selectedCategory}
      itemList={itemList}
      />
  

      
  </div>
  
}



export default function AllItemlist(){
  
  const {baseUrl, categoryList , setCategoryList } = useContext(Context)
  const {itemList, setItemList } = useContext(AdminpageContext)
  const [selectedCategory, setSelectedCategory] = useState('')
  
  return <div>

  <Table itemList={itemList} 
  categoryList={categoryList} 
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}/>
  <hr/>
  
  <button onClick={()=>{
    if(categoryList.length === 0){
      fetchCategoryList(baseUrl, setCategoryList)
    }
    fetchList(setItemList, baseUrl)
  }}> fetch Data</button>
  

  
  </div>
}



