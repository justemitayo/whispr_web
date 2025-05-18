import React from 'react'
import { ReactComponent as SearchModal } from '../../assets/svg/search-modal.svg' 
import './Modal.css'


interface props{
  setAllUser :  React.Dispatch<React.SetStateAction<boolean>>
}
const Modal = ({setAllUser}:props) => {
  return (
    <div className='modal'>
      <h2>Conversation</h2>
      <div className='modal-content'>
        <SearchModal style={{width:'2.5rem', height:'2.5rem'}} onClick={() => setAllUser(true)}/>
      </div>
    </div>
  )
}

export default Modal



