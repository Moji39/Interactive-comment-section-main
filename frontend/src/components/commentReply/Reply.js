import React, { useState, useEffect } from 'react'
import './Reply.css'

export default function ({j, parentId, stopReplying, image, replyComment}) {

    let [text, setText] = useState('')
    let [empty, setEmpty] = useState(null)

    function onChangeHandler(e){
        setText(() => e.target.value)
    }

    function onClickHandler(e){
        e.preventDefault();
        if(empty == false){
            replyComment(parentId, text)
            stopReplying()
        } 
        else 
            setEmpty(true)
        setText('') 
    }
    
    useEffect(() => text === '' ? setEmpty(null) : setEmpty(false), [text]) 

    return (
    <div className="reply-container" style={{paddingLeft: '25px'}}>
        <div className="reply-card">
            <textarea value={text} className={empty === true ? 'isEmpty' : ''} placeholder="Reply to the comment" onChange={event => onChangeHandler(event)}></textarea>
            <div className="bottom">
                <img src={require('../../images/avatars/image-' + image)} alt="user"/>
                <button onClick={event => onClickHandler(event)}>Reply</button>
            </div>
        </div>
    </div>
  )
}
