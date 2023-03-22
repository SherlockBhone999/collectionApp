import { useContext, useEffect, useState } from 'react'
import {Context } from '../Gallery'
import axios from 'axios'

import girlphoto from '../../assets/23.jpg'



const fetchList = (setListToFetch, chosenCategory, baseUrl) => {
  axios.get(`${baseUrl}/list/`)
  .then(res =>{
    const array = res.data
    setListToFetch(array)
  })
}


const fetchItem = async (list,setList,id, baseUrl) => {
    const arrayOfId = []
    for(let i=0; i<= list.length-1; i++){
      arrayOfId[i] = list[i].id
    }
    if(arrayOfId.includes(id)) return 
    
    await axios.get(`${baseUrl}/list/${id}`, {responseType: "arraybuffer"})
    .then( res => {
      const data = res.data
      
      const base64 = btoa(
        new Uint8Array(data).reduce(
          (dataa,byte) => dataa + String.fromCharCode(byte), '')
        )
  
      const item = { id : id, base64 : base64 }
      setList(prevv => [...prevv, item])
      
    })
  }
  
//useEffect is fetching twice so i did this but it doesn't solve kinda

const clearDuplicatesForFetch = (list,setList) => {
    const newArray = []
    list.map(item => {
      if(newArray.length === 0){ newArray.push(item) }
      else{
        const newArrayIdList = []
        newArray.map(item2 => {
          newArrayIdList.push(item2.id)
        })
        if(newArrayIdList.includes(item.id)) return
        newArray.push(item)
      }
    })
    setList(newArray)
}
 



const gdrivelist = (baseUrl) => {
  axios.get(`${baseUrl}/listFile`)
  .then(res => {
    console.log('gdrive list response')
    console.log(res)
  })
}
  
// get base64 from girlphoto img file and render it
const getBlobfromImage = (setimg) => {
  const girlimg = document.getElementById('girlphoto')
  fetch(girlimg.src)
        .then((res) => res.blob())
        .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                setimg(base64)
            };
            reader.readAsDataURL(blob);
        });
} 
 
const todownload = async (baseUrl, setImgFromGdrive) => {
  await axios.get(`${baseUrl}/download`)
  .then( res =>{
    /*
    const blob = res.data
    const myFile = new File([blob], 'image.jpg', {
      type: 'image/jpeg',
    });

    
    const reader = new FileReader();
    reader.readAsDataURL(myFile);
    reader.onloadend = function () {
      const base64 = reader.result
      */
    }
)}
  
 
 
export default function Gallery (){
  const { list, setList, chosenCategory, baseUrl } = useContext(Context)
  const [ listToFetch, setListToFetch ] = useState([])
  const [img , setimg ] = useState('')
  const [imgFromGdrive, setImgFromGdrive ] = useState('')
  
  
  useEffect(()=>{

    listToFetch.map((item) => {
      fetchItem(list,setList, item._id, baseUrl)
    })
    clearDuplicatesForFetch(list,setList)
    
    
  },[listToFetch])



  useEffect(()=>{
    fetchList(setListToFetch, chosenCategory, baseUrl)
    
    //gdrivelist(baseUrl)
    todownload(baseUrl, setImgFromGdrive)
    
    getBlobfromImage(setimg)
  },[])
  

  
  return <div class='grid grid-cols-4'>
  
  {list.map( item => <div>
    <img src={`data:;base64,${item.base64} `}  />
  </div>)}
  
  <img src={img} /> 
  
  <img src={girlphoto} id='girlphoto'/>
  
  <img src={imgFromGdrive} />

  </div>
}