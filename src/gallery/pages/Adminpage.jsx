
import {useState, createContext, useContext, useEffect } from 'react'
import Form from '../components/Form'
import AllItemlist from '../components/AllItemlist'
import EditCategory from '../components/EditCategory'
import { useNavigate } from 'react-router-dom'
import {Context} from '../Gallery'


const Chosen = () => {
  const {chosenComponent} = useContext(AdminpageContext)
  if(chosenComponent === 'form'){
    return <Form />
  }else if(chosenComponent === 'allitem'){
    return <AllItemlist />
  }else if(chosenComponent === 'editcategory'){
    return <EditCategory />
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
  const {setChosenComponent, formInitialData} = useContext(AdminpageContext)
  
  return <div>
  <button onClick={()=>navigate('/')}> homepage </button>
  
  <div>
    <button onClick={()=>setChosenComponent('form')} class='m-3'>form </button>
    <button onClick={()=>setChosenComponent('allitem')} class='m-3'>edit item </button>
    <button onClick={()=>setChosenComponent('editcategory')} class='m-3'>edit category</button>
  </div>
  
  <Chosen />
  
  <button onClick={()=>console.log(formInitialData)}>show formInitialData</button>
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

