import { useContext, useEffect, useState , useRef } from 'react'
import {Context } from '../Gallery'
import axios from 'axios'
import loadingGif from '../../assets/Loading_icon.gif'
import { useNavigate } from 'react-router-dom'

const fetchList = async (setListToFetch, baseUrl, chosenCategory) =>{
  const data = {category : chosenCategory }
  await axios.post(`${baseUrl}/fetchlistfromdb`,data )
  .then(res => {
    setListToFetch(res.data)
  })
}

const fetchItem = async (item, setList,baseUrl,list) => {
  const data = { name : item.name , id : item.profileImgLink }
  
  await axios.post(`${baseUrl}/fetchimgfrombackend`, data, {responseType : "arraybuffer"})
  .then( (res) => {
      const data = res.data
      
      const base64 = btoa(
        new Uint8Array(data).reduce(
          (dataa,byte) => dataa + String.fromCharCode(byte), '')
        )
      
      const itemm = {...item, base64 : base64}
      setList(prevv => [...prevv, itemm ])
      
    })
  .catch((err)=>{
    console.log(err.response.status, item._id + 'fetch fail')
    fetchItem2(item, setList, baseUrl, list)
  })
}

const fetchItem2 = async (item, setList,baseUrl,list) => {
  const data = { name : item.name , id : item.profileImgLink }
  
  await axios.post(`${baseUrl}/fetchimgfrombackend`, data, {responseType : "arraybuffer"})
  .then( (res) => {
      const data = res.data
      
      const base64 = btoa(
        new Uint8Array(data).reduce(
          (dataa,byte) => dataa + String.fromCharCode(byte), '')
        )
      
      const itemm = {...item, base64 : base64}
      setList(prevv => [...prevv, itemm ])
      
    })
  .catch((err)=>{
    console.log(err.response.status, item._id + 'second fetch fail')
  })
}


const fetchCategoryList = async (baseUrl, setCategoryList) => {
  await axios.get(`${baseUrl}/getcategorylist`)
  .then((res)=>{
    setCategoryList(res.data)
  })
}


const OneItem = ({index, item}) => {
  const navigate = useNavigate()
  const {baseUrl, list, setList, setItemForItempage} = useContext(Context)
  if(list[index]){
    return <div class='w-10/12 h-[140px]'>
      <img src={`data:;base64,${list[index].base64} `} class='w-full h-full object-cover'
      onClick={()=>{
        setItemForItempage(list[index])
        navigate(`/${list[index]._id}`)
      }}/>
      <div>{list[index].name}</div>
    </div>
  }else{
    return <div>
      <img src={loadingGif} />
      <div>{item.name}</div>
    </div>
  }
}

export default function Gallery(){
  const [listToFetch, setListToFetch ] = useState([])
  const {baseUrl, chosenCategory, setChosenCategory , list, setList, categoryList, setCategoryList } = useContext(Context)
  const [categoryBoxStyle, setCategoryBoxStyle ] = useState('')
  
  useEffect(()=>{
    listToFetch.map(item => {
      fetchItem(item,setList,baseUrl,list)
    })
  },[listToFetch])
  
  
  
  useEffect(()=>{
    setList([])
    fetchList(setListToFetch, baseUrl , chosenCategory)
  },[chosenCategory])
  
  useEffect(()=>{
    fetchCategoryList(baseUrl, setCategoryList)
  },[])
  
  useEffect(()=>{
    if(list.length >= listToFetch.length || listToFetch.length===0){
      setCategoryBoxStyle('')
    }else{
      setCategoryBoxStyle('opacity-40')
    }
  },[list, listToFetch])
  
  
  return <div class=''>

  <div class={`bg-blue-200 p-2 m-1 ${categoryBoxStyle}`}>
  <button onClick={()=>setChosenCategory('')}> all </button>
  {
    categoryList.map(item => <div>
      <button onClick={()=>{
        if(categoryBoxStyle === ''){
          setChosenCategory(item.category)
        }else{
          
        }
      } }>{item.category}</button>
    </div>)
  }
  </div>
  <p>chosenCategory : {chosenCategory}</p>
  
  <div>{listToFetch.length}</div>
  

    <div class='grid grid-cols-4 gap-5 ml-4'>
    {listToFetch.map((item,index) => <div >
      <OneItem index={index} item={item} />
    </div>)
    }
    </div>


  </div>
}



