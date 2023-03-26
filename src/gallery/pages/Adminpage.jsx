
import {useState, createContext, useContext, useEffect } from 'react'
import Form from '../components/Form'
import AllItemlist from '../components/AllItemlist'
import { useNavigate } from 'react-router-dom'
import {Context} from '../Gallery'


const Chosen = () => {
  const {chosenComponent} = useContext(AdminpageContext)
  if(chosenComponent === 'form'){
    return <Form />
  }else if(chosenComponent === 'allitem'){
    return <AllItemlist />
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


const Content = () => {
  const navigate = useNavigate()
  const {setChosenComponent} = useContext(AdminpageContext)
  
  return <div>
  <button onClick={()=>navigate('/')}> homepage </button>
  
  <div>
    <button onClick={()=>setChosenComponent('form')} class='m-3'>form </button>
    <button onClick={()=>setChosenComponent('allitem')} class='m-3'>all itemlist </button>
  </div>
  
  <Chosen />
  </div>
}



export const AdminpageContext = createContext()

export default function Adminpage(){
  const [chosenComponent, setChosenComponent] = useState('')
  const [formInitialData, setFormInitialData] = useState(initialData)
  const [previewImg, setPreviewImg] = useState('')
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [itemList, setItemList ] = useState([])
  const [showUpdateButton, setShowUpdateButton ] = useState('hidden')
  const {isAdmin} = useContext(Context)
  const navigate = useNavigate()
  
  useEffect(()=>{
    if(isAdmin !== 'yes'){
      navigate('/')
    }
  },[])
  
  return <AdminpageContext.Provider value={{
    chosenComponent,
    setChosenComponent,
    formInitialData,
    setFormInitialData,
    previewImg,
    setPreviewImg,
    isUpdateMode,
    setIsUpdateMode,
    itemList,
    setItemList,
    showUpdateButton,
    setShowUpdateButton
  }}>
  <Content />
  </AdminpageContext.Provider>
}

