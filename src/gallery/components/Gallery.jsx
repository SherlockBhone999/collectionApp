import { useContext, useEffect, useState , useRef } from 'react'
import {Context } from '../Gallery'
import axios from 'axios'
import loadingGif from '../../assets/Loading_icon.gif'
import { useNavigate } from 'react-router-dom'

const fetchList = async (setListToFetch, baseUrl, chosenCategory,currentPageNumber) =>{
  const data = {category : chosenCategory, pageNumber : currentPageNumber }
  await axios.post(`${baseUrl}/fetchlimiteditemlistfromdb`,data )
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
    console.log('get categoryList', res.data)
    setCategoryList(res.data)
  }) 
}

const fetchAllItemListForPageNumberCount = (baseUrl,setPageCount, chosenCategory) => {
  const data = {category :chosenCategory }
  axios.post(`${baseUrl}/fetchallitemlistfromdb`,data )
  .then(res => {
    const l = res.data.length
    setPageCount(l)
  })
}


const OneItem = ({index, item}) => {
  const navigate = useNavigate()
  const {baseUrl, list, setList, setItemForItempage} = useContext(Context)
  if(list[index]){
    return <div>
    
    <div class='h-[160px]'>
      <img src={`data:;base64,${list[index].base64} `} class='w-full h-full object-cover border-2 border-black shadow rounded'
      onClick={()=>{
        setItemForItempage(list[index])
        navigate(`/${list[index]._id}`)
      }}/>
    </div>
      <div class='flex justify-center'>{list[index].name}</div>
      <div >rating : {list[index].rating}</div>
    </div>
  }else{
    return <div>
      <img src={loadingGif} />
    </div>
  }
}

const OnePageButton = ({int,currentPageNumber,setCurrentPageNumber }) => {
  const [style, setStyle] = useState('bg-gray-400')
  
  useEffect(()=>{
    if(int === currentPageNumber){
      setStyle('bg-blue-400')
    }else{
      setStyle('bg-gray-400')
    }
  },[currentPageNumber])
  
  return <div>
    <button class={`p-2 m-2 w-10 rounded ${style}`} 
    onClick={()=>setCurrentPageNumber(int)}>{int}</button> 
  </div>
}

const PageNumbersBox = ({setCurrentPageNumber,currentPageNumber}) =>{
  const [pageCount, setPageCount ] = useState(0)
  const {baseUrl, chosenCategory} = useContext(Context)
  const [pageList, setPageList ] = useState([])
  
  useEffect(()=>{
    fetchAllItemListForPageNumberCount(baseUrl,setPageCount,chosenCategory)
  },[chosenCategory])
  
  useEffect(()=>{
    const biggestNumber = Math.floor(pageCount /12) + 1
    const array = []
    for(let i=0; i< biggestNumber; i++){
      array.push(i+1)
    }
    setPageList(array)
  },[pageCount])
  
  
  return <div>
    <div class='p-2 m-2 rounded flex justify-center'>
        {pageList.map(int => <div>
          <OnePageButton int={int} 
          currentPageNumber={currentPageNumber}
          setCurrentPageNumber={setCurrentPageNumber}/>
        </div>)}
    </div>
  </div>
}

export default function Gallery(){
  const [listToFetch, setListToFetch ] = useState([])
  const {baseUrl, chosenCategory, setChosenCategory , list, setList, categoryList, setCategoryList } = useContext(Context)
  const [categoryBoxStyle, setCategoryBoxStyle ] = useState('')
  const [categoryBoxStyle2, setCategoryBoxStyle2 ] = useState('hidden')
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  
  useEffect(()=>{
    listToFetch.map(item => {
      fetchItem(item,setList,baseUrl,list)
    })
  },[listToFetch])
  
  
  
  useEffect(()=>{
    setList([])
    fetchList(setListToFetch, baseUrl , chosenCategory, currentPageNumber)
  },[chosenCategory, currentPageNumber])
  
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

    <div class={`relative ${categoryBoxStyle}`}>
      <div class='bg-black text-white rounded m-1 w-40'>
        <button onClick={()=>{
          if(categoryBoxStyle2==='hidden'){
            setCategoryBoxStyle2('')
          }else{
            setCategoryBoxStyle2('hidden')
          }
        }} class='w-full p-2'>{chosenCategory}</button>
      </div>
    
      <div class={`bg-blue-400 text-white rounded p-2 m-1 w-40 absolute top-6 h-60 overflow-scroll ${categoryBoxStyle2}`}>
      <button onClick={()=>{
    
          setChosenCategory('all')
          setCategoryBoxStyle2('hidden')
        
      }} class='w-full'> all </button>
      {
        categoryList.map(item => <div>
          <button onClick={()=>{
            if(categoryBoxStyle === ''){
              setChosenCategory(item.category)
              setCategoryBoxStyle2('hidden')
            }else{
              setCategoryBoxStyle2('hidden')
            }
          } } class='w-full'>{item.category}</button>
        </div>)
      }
      </div>
    </div>
   

    <div class='grid grid-cols-4 gap-7 m-2 p-2 border-4 border-black rounded bg-gray-200'>
      {listToFetch.map((item,index) => <div >
        <OneItem index={index} item={item} />
      </div>)
      }
    </div>
     
     <PageNumbersBox setCurrentPageNumber={setCurrentPageNumber} 
     currentPageNumber={currentPageNumber}
     />


  </div>
}



