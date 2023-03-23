
import {useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {Context} from '../Gallery'

const ForYoutubeLinks = ({field, setField}) => {
  
  const add = () => {
    const newobj = {videoLink : ''}
    setField([...field, newobj])
  }
  
  const remove = (index) => {
    const array = [...field]
    array.splice(index, 1)
    setField(array)
  }
  
  const update = (e,index) => {
    const input = e.target.value
    const array = [...field]
    array[index] = {videoLink : input }
    setField(array)
  }
  
  return <div class='grid'>
  { field.map((obj,index) => <div >
    <input type='text' placeholder='videoLink' onChange={(e)=>update(e,index)}/>
    <button type='button' onClick={()=>remove(index)}> - </button >
  </div> ) }
  <button type='button' onClick={add}> + </button>
  </div>
}

const ForImgLinks = ({field, setField}) => {
  
  const add = () => {
    const newobj = {imgLink : ''}
    setField([...field, newobj])
  }
  
  const remove = (index) => {
    const array = [...field]
    array.splice(index, 1)
    setField(array)
  }
  
  const update = (e,index) => {
    const input = e.target.value
    const array = [...field]
    array[index] = {imgLink : input }
    setField(array)
  }
  
  return <div class='grid'>
  { field.map((obj,index) => <div >
    <input type='text' placeholder='imgLink' onChange={(e)=>update(e,index)}/>
    <button type='button' onClick={()=>remove(index)}> - </button >
  </div> ) }
  <button type='button' onClick={add}> + </button>
  </div>
}



export default function Form (){
  const [formdata, setFormdata ] = useState({})
  const [youtubeLinksField, setYoutubeLinksField ] = useState([{videoLink : ''}])
  const [imgLinksField, setImgLinksField ] = useState([ {imglink : ''}])
  const [chosenImage, setChosenImage ] = useState({})
  const [nameOfImageSavedInBackend, setNameOfImageSavedInBackend] = useState('')
  const [buttonN1, setButtonN1 ] = useState(true)
  
  
  const updateName = (e) => {
    const input = e.target.value
    const obj = {...formdata, name : input}
    setFormdata(obj)
  }
  
  const updateEnjoyedYear = (e) => {
    const input = e.target.value
    const obj = {...formdata, enjoyedYear : input}
    setFormdata(obj)
  }
  
  const updateReasonToLike = (e) => {
    const input = e.target.value
    const obj = {...formdata, reasonToLike : input}
    setFormdata(obj)
  }
  
  const updateMyComment = (e) => {
    const input = e.target.value
    const obj = {...formdata, myComment : input}
    setFormdata(obj)
  }
  
  const updateMyRating = (e) => {
    const input = e.target.value
    const obj = {...formdata, myRating : input}
    setFormdata(obj)
  }
  
  const updateCategory = (e) => {
    const input = e.target.value
    const obj = {...formdata, category : input}
    setFormdata(obj)
  }
  
  const updateImgFile = (e) => {
    const inputFile = e.target.files[0]
    setChosenImage(inputFile)
  }
  
  const sendimg = async (e) => {
    //e.preventDefault()
    const config = {
      headers :{
        "content-type":"multipart/form-data"
      }
    }
    await axios.post('http://localhost:3000/sendimg',{img : chosenImage},config )
    .then(res =>{
      setNameOfImageSavedInBackend(res.data)
    })
  }
  
  const uploadimg =async () => {
    await axios.post('http://localhost:3000/upload', formdata )
    .then(()=>console.log('submitted :' + formdata ))
    setButtonN1(true)
  }
  
  
  const handleSubmit = async (e) =>{
    e.preventDefault()
    sendimg()
    setButtonN1(false)
  }
  
  useEffect(()=>{
    const data = {...formdata, youtubeLinks : youtubeLinksField, imgLinks : imgLinksField }
    setFormdata(data)
  },[youtubeLinksField,imgLinksField])
  
  useEffect(()=>{
    console.log(formdata)
  },[formdata])
  
  useEffect(()=>{
    const data = {...formdata, imgNameInBackend : nameOfImageSavedInBackend }
    setFormdata(data)
  },[nameOfImageSavedInBackend])
  
  return <div>
  <div class='flex w-full'>
  
  <form class='p-2 bg-gray-200 grid gap-2'>
  <input type='file' onChange={updateImgFile} />
  <input type='text' placeholder = 'name' onChange={updateName} />
  <input type='text' placeholder='category' onChange={updateCategory} />
  <input type = 'text' placeholder = 'enjoyedYear' onChange={updateEnjoyedYear} />
  <textarea placeholder='reasonToLike' onChange={updateReasonToLike}/>
  <textarea placeholder='myComment' onChange={updateMyComment}/>
  <input type='number' placeholder='myRating' onChange={updateMyRating} />
  <ForYoutubeLinks field={youtubeLinksField} setField={setYoutubeLinksField} />
  <ForImgLinks field={imgLinksField} setField={setImgLinksField} />
  { buttonN1? 
  <button type='submit' onClick={handleSubmit} > submit 1</button>
  :
  <button onClick={uploadimg} > submit 2 </button>
  }
  </form>

  </div>

  </div>
}
