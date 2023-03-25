import { useContext, useEffect, useState } from 'react'
import {Context } from '../Gallery'
import axios from 'axios'



const fetchListFromGdrive = async (setList,baseUrl) =>{
  await axios.get(`${baseUrl}/allgdrivelist`)
  .then(res => {
    setList(res.data)
  })
}



const fetchItemFromDB = async (id, name,setList,baseUrl,list) => {
  
  axios.post(`${baseUrl}/fetchitemfromdb`, { gdriveId : id } )
  .then((res)=>{
    const resItem = res.data
    console.log(resItem)
    setList( prevv => {
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

 

export default function AllItemlist(){
  const [list, setList ] = useState([])
  const [hide, setHide ] = useState('hidden')
  const {baseUrl } = useContext(Context)
  
  
  return <div>
  
  
  <div class='m-2 p-2 bg-gray-200 rounded border-2 border-black' >
  <p>  {list.length }</p>
  {
    list.map(item => <div>
      <p>
      <span>{item.name}</span>  
      <span> {item._id}</span>
      <button class={`ml-2 bg-blue-400 rounded-lg p-1 text-white ${hide}`}>update </button>
      <button class={`ml-2 bg-red-400 rounded-lg p-1 text-white ${hide}`} onClick={()=>deleteItem(item._id, item.profileImgLink,baseUrl)}>delete </button>
      </p>
    </div>)
  }
  </div>

  <div>
  <button onClick={()=>fetchListFromGdrive(setList,baseUrl)}> fetch all items from gdrive</button>
  </div>
  
  <div>
  <button onClick={()=>{
    list.map((item)=>{
      fetchItemFromDB(item.id, item.name, setList, baseUrl, list )
      setHide('')
    })
  }}> fetch corresponding items from dstabase </button>
  </div>
  

  </div>
}



