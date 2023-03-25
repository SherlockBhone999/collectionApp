
import {useState} from 'react'
import Form from '../components/Form'
import AllItemlist from '../components/AllItemlist'


const Chosen = ({chosen}) => {
  if(chosen === 'form'){
    return <Form />
  }else if(chosen === 'allitem'){
    return <AllItemlist />
  }
}


export default function Adminpage(){
  const [chosen, setChosen ] = useState('')
  
  return <div>
  <div>
    <button onClick={()=>setChosen('form')} class='m-3'>form </button>
    <button onClick={()=>setChosen('allitem')} class='m-3'>all itemlist </button>
  </div>
  <Chosen chosen={chosen} />
  </div>
}