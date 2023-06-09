
import {useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {Context} from '../Gallery'
import {AdminpageContext} from '../pages/Adminpage'

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
    <input type='text' placeholder='videoLink' onChange={(e)=>update(e,index)} value={field[index].videoLink}/>
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
    <input type='text' placeholder='imgLink' onChange={(e)=>update(e,index)} value={field[index].imgLink}/>
    <button type='button' onClick={()=>remove(index)}> - </button >
  </div> ) }
  <button type='button' onClick={add}> + </button>
  </div>
}

  const sendimg = async (e, chosenImage, setNameOfImageSavedInBackend, baseUrl) => {
    //e.preventDefault()
    const config = {
      headers :{
        "content-type":"multipart/form-data"
      }
    }
    await axios.post(`${baseUrl}/saveimg`,{img : chosenImage},config )
    .then(res =>{
      setNameOfImageSavedInBackend(res.data)
    })
  }
  
  const uploadimg = async (setButtonN1, formdata, baseUrl) => {
    await axios.post(`${baseUrl}/upload`, formdata )
    .then(()=>console.log('submitted :' + formdata ))
    setButtonN1('1')
  }
  
  
  const saveImg = async (e,chosenImage,setNameOfImageSavedInBackend,setButtonN1, baseUrl) =>{
    e.preventDefault()
    sendimg(e,chosenImage,setNameOfImageSavedInBackend, baseUrl)
    setButtonN1('2')
  }



const saveUpdatedImg = async (e, chosenImage, setNameOfImageSavedInBackend, setButtonN1, previewImg , baseUrl, setPreviousImgName, formInitialData ) => {
  if(chosenImage){
    setButtonN1('4')
    e.preventDefault()
    sendimg(e, chosenImage, setNameOfImageSavedInBackend, baseUrl)
    setPreviousImgName(formInitialData.name)
  }else{
    e.preventDefault()
    setButtonN1('4')
  }
}

const uploadUpdatedImg = async (e,setButtonN1, formdata, baseUrl,chosenImage ) => {
  if(chosenImage){
    e.preventDefault()
    setButtonN1('5')
    await axios.post(`${baseUrl}/upload`, formdata)
    
  }else{
    //e.preventDefault()
    setButtonN1('5')
    await axios.post(`${baseUrl}/update`, formdata)
  
  }
}

const deletePreviousImg = async (formdata, baseUrl, chosenImage, setButtonN1, setIsUpdateMode) => {
  const data =  {profileImgLink : formdata.profileImgLink , _id : formdata._id }
  axios.post(`${baseUrl}/delete`, data )
  setButtonN1('3')
  setUpdate(false)
}


const Button = ({chosenImage, setNameOfImageSavedInBackend, 
setButtonN1, formdata, buttonN1, previewImg , baseUrl , setIsUpdateMode, setPreviousImgName, formInitialData } ) => {
  if(buttonN1==='1'){
    return <div>
      <button onClick={(e)=>saveImg(e, chosenImage, setNameOfImageSavedInBackend, setButtonN1, baseUrl )} >submit 1 </button>
    </div>
  }else if(buttonN1==='2'){
    return <div>
      <button onClick={()=>uploadimg(setButtonN1,formdata, baseUrl)}>submit 2 </button>
    </div>
  }else if(buttonN1==='3'){
    return <div>
      <button onClick={(e)=>saveUpdatedImg(e,chosenImage, setNameOfImageSavedInBackend, setButtonN1, previewImg, baseUrl, setPreviousImgName, formInitialData )}> update 1</button>
    </div>
  }else if(buttonN1==='4'){
    return <div>
      <button onClick={(e)=>uploadUpdatedImg(e,setButtonN1, formdata, baseUrl, chosenImage)}>update2</button>
    </div>
  }else if(buttonN1==='5'){
    return <div>
      <button onClick={()=>deletePreviousImg(formdata, baseUrl, chosenImage, setButtonN1, setIsUpdateMode)}> update 3</button>
    </div>
  }
}




export default function Form (){
  const { formInitialData, previewImg, isUpdateMode, setIsUpdateMode } = useContext(AdminpageContext)
  const [formdata, setFormdata ] = useState(formInitialData)
  const [youtubeLinksField, setYoutubeLinksField ] = useState(formdata.youtubeLinks)
  const [imgLinksField, setImgLinksField ] = useState(formdata.imgLinks)
  const [chosenImage, setChosenImage ] = useState('')
  const [nameOfImageSavedInBackend, setNameOfImageSavedInBackend] = useState('')
  const [buttonN1, setButtonN1 ] = useState('1')
  const {baseUrl} = useContext(Context)
  
  //for delete purpose
  const [previousImgName, setPreviousImgName] = useState('')
  
  
  
  const updateName = (e) => {
    if(!chosenImage){
      //when update don`t let name change unless img change
      return
    }else{
      const input = e.target.value
      const obj = {...formdata, name : input}
      setFormdata(obj)
    }
    
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

  useEffect(()=>{
    const data = {...formdata, youtubeLinks : youtubeLinksField, imgLinks : imgLinksField }
    setFormdata(data)
  },[youtubeLinksField,imgLinksField])
  
  
  
  useEffect(()=>{
    const data = {...formdata, imgNameInBackend : nameOfImageSavedInBackend }
    setFormdata(data)
  },[nameOfImageSavedInBackend])
  
  useEffect(()=>{
    if(formdata.name !== ''){
      setButtonN1('3')
    }
  },[previewImg])
  
  useEffect(()=>{
    const data = {...formdata, previousImgName : previousImgName }
    setFormdata(data)
  },[previousImgName])
  
  return <div>
  
  {isUpdateMode?
  <div class='w-40'>
    <img src={`data:;base64,${previewImg}`} />
  </div>
  : null
  }
  
  
  
  <div class='flex w-full'>
  <form class='p-2 bg-gray-200 grid gap-2'>
  <input type='file' onChange={updateImgFile} />
  <input type='text' placeholder = 'name' onChange={updateName} value={formdata.name.split('.jpg').join('')} />
  <input type='text' placeholder='category' onChange={updateCategory} value={formdata.category}/>
  <input type = 'text' placeholder = 'enjoyedYear' onChange={updateEnjoyedYear} value={formdata.enjoyedYear}/>
  <textarea placeholder='reasonToLike' onChange={updateReasonToLike} value={formdata.reasonToLike}/>
  <textarea placeholder='myComment' onChange={updateMyComment} value={formdata.myComment} />
  <input type='number' placeholder='myRating' onChange={updateMyRating} value={formdata.myRating} />
  <ForYoutubeLinks field={youtubeLinksField} setField={setYoutubeLinksField} />
  <ForImgLinks field={imgLinksField} setField={setImgLinksField} />

  <Button chosenImage={chosenImage} 
  setNameOfImageSavedInBackend={setNameOfImageSavedInBackend} 
  setButtonN1={setButtonN1} 
  formdata={formdata} 
  buttonN1={buttonN1} 
  previewImg={previewImg}
  baseUrl={baseUrl}
  setIsUpdateMode={setIsUpdateMode}
  setPreviousImgName={setPreviousImgName}
  formInitialData={formInitialData}
  />
  
  </form>
  
  
  </div>

  </div>
}
