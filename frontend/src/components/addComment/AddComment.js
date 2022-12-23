import React, { useState, useEffect } from 'react'
import './addComment.css'
import { Link } from 'react-router-dom'

function Add({image, addComment}){

  let [text, setText] = useState('')
  let [empty, setEmpty] = useState(null)

  function onChangeHandler(e){
    setText(e.target.value)
  }

  function onClickHandler(e){
    e.preventDefault();
    empty == false ? addComment(text) : setEmpty(true)
    setText('')    
  }

  useEffect(() => text === '' ? setEmpty(null) : setEmpty(false), [text]) 
  
  return(
    <form>
      <textarea name="newComment" className={empty === true ? 'isEmpty' : ''} value={text} placeholder="Add a comment"  onChange={event => onChangeHandler(event)}></textarea>
      <div className="bottom">
        <img src={require('../../images/avatars/image-' + image)} alt="user"/>
        <button onClick={event => onClickHandler(event)}>send</button>
      </div>
    </form>
  )
}

function Login(){
  return(
    <Link className="login" to="/login">Login</Link>  
  )
}

export default function AddComment({isLoggedin, image, addComment}) {
  return (
    <div className="new-container">
      {isLoggedin ? <Add image={image} addComment={addComment}/> : <Login />}
    </div>  
  )
}