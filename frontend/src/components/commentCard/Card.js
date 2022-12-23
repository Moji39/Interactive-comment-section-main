import React, { useState, useRef, useEffect } from 'react'
import './Card.css'
import CommentUser from '../commentUser/User' 
import CommentScore from '../commentScore/Score' 
import CommentActions from '../commentActions/Actions' 
import CommentReply from '../commentReply/Reply'

export default function Card({comment, imageLink, j, rating, parentId, userId, isLoggedin, isOwner, replyTo, deleteComment, replyComment, editComment, setCommentScoreNN}) {
    let oldContent = comment.content
    let [isEditing, setIsEditing] = useState(false)
    let [isReplying, setIsReplying] = useState(false)
    let [newContent, setNewContent] = useState(oldContent)

    const ref = useRef()

    function onChangeHandler(e){
        setNewContent(() => e.target.value)
    }

    function onClickHandler(e){
        e.preventDefault()
        if(newContent === oldContent || newContent === '')
            setNewContent(oldContent)
        else{
            oldContent = newContent
            editComment(comment.id, newContent)
        }
        setIsEditing(false)
    }

    function taStyle(){
        ref.current.style.height = '1px'
        ref.current.style.height = ref.current.scrollHeight + 'px'
        ref.current.value = oldContent
    }

    useEffect(() => {
        if(isEditing)
            taStyle()
    }, [isEditing])
    
    return(
        comment && <>
            <div className="card">
                <CommentUser user={comment.user} isOwner={isOwner} createdSince={comment.created_since}/>
                {isEditing === false &&
                    <p className="comment">{replyTo && <span className="reply-to">{'@' + replyTo }</span>}{' ' + comment.content}</p>
                }
                {isEditing === true &&
                    <div className="isEditing">
                        <textarea ref={ref} type="text" value={newContent} onChange={event => onChangeHandler(event)}></textarea>
                        <button onClick={event => onClickHandler(event)}>Update</button>
                    </div>
                }
                <div className="base">
                    <CommentScore setCommentScoreNN={setCommentScoreNN} commentId={comment.id} rating={rating} userId={userId} score={comment.score} isLoggedin={isLoggedin}/>
                    <CommentActions taStyle={taStyle} commentId={comment.id} parentId={parentId} isOwner={isOwner} deleteComment={deleteComment} editComment={() => setIsEditing(!isEditing)} replyComment={() => setIsReplying(!isReplying)} isLoggedin={isLoggedin}/>
                </div>
            </div>
            {isReplying && !isOwner && <CommentReply j={j} image={imageLink} stopReplying={() => setIsReplying(false)} replyComment={replyComment} parentId={parentId}/>}
        </>
    )
}