import React from "react"
import './Actions.css'

function Edit({deleteComment, editComment, commentId, parentId}){

    return(
        <>
            <button className="delete" onClick={() => deleteComment(commentId, parentId)}>
                <img src={require ('../../images/icon-delete.svg').default} alt="" />
                Delete
            </button>
            <button className="edit" onClick={editComment}>
                <img src={require ('../../images/icon-edit.svg').default} alt="" />
                Edit
            </button>
        </>
    )
}

function Reply({replyComment}){
    return(
        <button className="reply" onClick={replyComment}>
            <img src={require ('../../images/icon-reply.svg').default} alt="" />
            Reply
        </button>
    )
}

export default function Actions({isLoggedin, isOwner, commentId, parentId, editComment, deleteComment, replyComment}){
    return(
        isLoggedin && <div className="actions">
            {isOwner ? <Edit editComment={editComment} commentId={commentId} parentId={parentId} deleteComment={deleteComment}/> : <Reply replyComment={replyComment}/>} 
        </div>
    )
}