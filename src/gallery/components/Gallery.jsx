import { useContext, useEffect, useState } from 'react'
import {Context } from '../Gallery'
import axios from 'axios'



const fetchList = async (setListToFetch,baseUrl) =>{
  await axios.get(`${baseUrl}/allgdrivelist`)
  .then(res => {
    setListToFetch(res.data)
  })
}



const fetchItem = async (id, name, setList,baseUrl,list) => {
  const data = { name : name , id : id }
  

  
  await axios.post(`${baseUrl}/fetchitemfromgdrive`, data, {responseType : "arraybuffer"})
  .then( res => {
      const data = res.data
      
      const base64 = btoa(
        new Uint8Array(data).reduce(
          (dataa,byte) => dataa + String.fromCharCode(byte), '')
        )
      
      const item = { base64 : base64 , gdriveId : id}
      setList(prevv => [...prevv, item ])
      
    })

setTimeout(()=>{
  
axios.post(`${baseUrl}/fetchitemfromdb`, { gdriveId : id } )
  .then((res)=>{
    const resItem = res.data[0]
    setList( prevv => {
      const arr = [...prevv]
      for(let i=0; i< arr.length; i++){
        if(arr[i].gdriveId === id ){
          const newItem = {...arr[i], ...resItem}
          arr[i] = newItem
        }
      }
      return arr
    })
  })
  
},100)
  


}


const deleteItem = (item,baseUrl) => {

}



export default function Gallery(){
  const [list, setList] = useState([])
  const [listToFetch, setListToFetch ] = useState([])
  const {baseUrl, chosenCategory } = useContext(Context)
  
  useEffect(()=>{
    
    //temp comment out to test delete
    listToFetch.map(item => {
      fetchItem(item.id, item.name,setList,baseUrl,list)
    })
    
  },[listToFetch])
  
  useEffect(()=>{
    console.log('list :')
    list.map((a)=>{
      console.log(a)
    })
  },[list])
  
  return <div>

  {list.map( item => <div>
    <img src={`data:;base64,${item.base64} `}  />
  </div>)}
  
  
  <div class='m-3 p-3 bg-gray-400 rounded border-2 border-black' >
  items in gdrive :
  {
    listToFetch.map(item => <div>
      {item.name}
      <button class='p-1 bg-red-400 m-1' onClick={()=>deleteItem(item,baseUrl)}> delete </button >
      
    </div>)
  }
  </div>

  <div>
  <button onClick={()=>fetchList(setListToFetch,baseUrl)}> fetch all items in gdrive</button>
  </div>
  

  </div>
}



