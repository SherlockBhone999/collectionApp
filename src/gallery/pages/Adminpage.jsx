
import {useState} from 'react'
import Form from '../components/Form'
import AllItemlist from '../components/AllItemlist'


const Chosen = ({chosen, setChosen, formInitialData, setFormInitialData, previewImg, setPreviewImg}) => {
  if(chosen === 'form'){
    return <Form initialData={formInitialData} previewImg={previewImg}/>
  }else if(chosen === 'allitem'){
    return <AllItemlist setChosenInterface={setChosen} setFormInitialData={setFormInitialData} setPreviewImg={setPreviewImg}/>
  }
}

const initialData = {
  name : '',
  enjoyedYear : '',
  reasonToLike : '',
  myComment : '',
  myRating : 0,
  category : '',
  youtubeLinks : [{videoLink : ''}],
  imgLinks : [{imgLink : ''}],
}

export default function Adminpage(){
  const [chosen, setChosen ] = useState('')
  const [formInitialData, setFormInitialData] = useState(initialData)
  const [previewImg, setPreviewImg ] = useState('')
  
  return <div>
  <div>
    <button onClick={()=>setChosen('form')} class='m-3'>form </button>
    <button onClick={()=>setChosen('allitem')} class='m-3'>all itemlist </button>
  </div>
  <Chosen chosen={chosen} 
  setChosen={setChosen} 
  formInitialData={formInitialData} 
  setFormInitialData={setFormInitialData} 
  previewImg={previewImg} 
  setPreviewImg={setPreviewImg} />
  </div>
}