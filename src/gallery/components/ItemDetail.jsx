import {useContext, useState, useEffect} from 'react'
import {Context} from '../Gallery'
import {useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReactPlayer from 'react-player/youtube'


const fetchItem = async (setItemForItempage, baseUrl, id, itemForItempage) =>{
  const data = {_id : id }
  await axios.post(`${baseUrl}/fetchitemfromdbwithid`,data )
  .then(res => {
    setItemForItempage(res.data)
  })
}

const fetchImg = async (itemForItempage, setItemForItempage,baseUrl) => {
  const data = { name : itemForItempage.name , id : itemForItempage.profileImgLink }
  
  await axios.post(`${baseUrl}/fetchimgfrombackend`, data, {responseType : "arraybuffer"})
  .then( (res) => {
      const data = res.data
      
      const base64 = btoa(
        new Uint8Array(data).reduce(
          (dataa,byte) => dataa + String.fromCharCode(byte), '')
        )
      
      const itemm = {...itemForItempage, base64 : base64}
      setItemForItempage(itemm )
    })
    .catch(err =>{
      fetchImg2(itemForItempage, setItemForItempage, baseUrl)
    })
} 



const fetchImg2 = async (itemForItempage, setItemForItempage,baseUrl) => {
  const data = { name : itemForItempage.name , id : itemForItempage.profileImgLink }
  
  await axios.post(`${baseUrl}/fetchimgfrombackend`, data, {responseType : "arraybuffer"})
  .then( (res) => {
      const data = res.data
      
      const base64 = btoa(
        new Uint8Array(data).reduce(
          (dataa,byte) => dataa + String.fromCharCode(byte), '')
        )
      
      const itemm = {...itemForItempage, base64 : base64}
      setItemForItempage(itemm )
    })
} 




export default function ItemDetail(){
  const {itemForItempage, baseUrl, setItemForItempage } = useContext(Context)
  const location = useLocation()
  const navigate = useNavigate()
  
  useEffect(()=>{
    if(!itemForItempage.base64){
      const nn = location.pathname
      const nnn = nn.slice(1)
      fetchItem(setItemForItempage, baseUrl, nnn, itemForItempage)
    }
  },[])
  
  useEffect(()=>{
    if(itemForItempage._id){
      fetchImg(itemForItempage, setItemForItempage, baseUrl)
    }
  },[itemForItempage._id])
  return <div>
  
    <button onClick={()=>navigate('/')}>home</button>
  
    <div class='flex justify-center'>
      <div class='w-2/6'>
        <img src={`data:;base64,${itemForItempage.base64} `} class='w-full h-full object-cover' />
      </div>
    </div>
    
    <table class="table-auto">
      <tbody>
        <tr>
          <td>Name</td>
          <td>{itemForItempage.name}</td>
        </tr>
        <tr>
          <td>Rating</td>
          <td>{itemForItempage.rating}</td>
        </tr>
        <tr>
          <td>Category</td>
          <td>{itemForItempage.category}</td>
        </tr>
        <tr>
          <td>My Comment</td>
          <td>{itemForItempage.myComment}</td>
        </tr>
        <tr>
          <td>Why I like it</td>
          <td>{itemForItempage.reasonToLike}</td>
        </tr>
        <tr>
          <td>Enjoyed year</td>
          <td>{itemForItempage.enjoyedYear}</td>
        </tr>
      </tbody>
    </table>
     
    {itemForItempage.youtubeLinks?
    <div class='flex justify-center'>
        <ReactPlayer url={`${itemForItempage.youtubeLinks[0].videoLink}`} controls />
    </div>
    : null
    }
    <button onClick={()=>console.log(itemForItempage)}>show</button>
    
  </div>
}