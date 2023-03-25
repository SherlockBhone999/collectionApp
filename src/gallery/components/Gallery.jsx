import { useContext, useEffect, useState } from 'react'
import {Context } from '../Gallery'
import axios from 'axios'
import loadingGif from '../../assets/Loading_icon.gif'


const fetchList = async (setListToFetch, baseUrl, chosenCategory) =>{
  const data = {category : chosenCategory }
  await axios.post(`${baseUrl}/fetchlistfromdb`,data )
  .then(res => {
    console.log(res.data)
    setListToFetch(res.data)
  })
} 



const fetchItem = async (item, setList,baseUrl,list) => {
  const data = { name : item.name , id : item.profileImgLink }
  
  await axios.post(`${baseUrl}/fetchimgfromgdrive`, data, {responseType : "arraybuffer"})
  .then( res => {
      const data = res.data
      
      const base64 = btoa(
        new Uint8Array(data).reduce(
          (dataa,byte) => dataa + String.fromCharCode(byte), '')
        )
      
      const itemm = {...item, base64 : base64}
      setList(prevv => [...prevv, itemm ])
      
    })
}



export default function Gallery(){
  const [list, setList] = useState([])
  const [listToFetch, setListToFetch ] = useState([])
  const {baseUrl, chosenCategory, setChosenCategory } = useContext(Context)
  
  useEffect(()=>{
    //temp comment out to test delete
    listToFetch.map(item => {
      fetchItem(item,setList,baseUrl,list)
    })
  },[listToFetch])
  
  useEffect(()=>{
    fetchList(setListToFetch, baseUrl , chosenCategory)
  },[chosenCategory])
  
  
  return <div>
  <p>chosenCategory : {chosenCategory}</p>

  <div class='grid'>
  <button onClick={()=>{
    setChosenCategory('manhua')
    setList([])
  }}>manhua</button>
  
  <button onClick={()=>{
    setChosenCategory('hentai')
    setList([])
  }}>hentai</button>

  
  <button onClick={()=>{
    setChosenCategory('')
    setList([])
  }}>all </button>
  </div>
  
  <div>{listToFetch.length}</div>
  
  {listToFetch.map((item,index) => <div>
    <div class='w-40'>
      { list[index]? <img src={`data:;base64,${list[index].base64} `}  />
        : <img src={loadingGif} />
      }
    </div>
  </div>)
  }
  

  </div>
}



