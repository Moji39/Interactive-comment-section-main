import React, { useContext, useEffect, useState, useReducer } from 'react'
import './commentsPage.css'
import AuthContext from '../../contextes/AuthContext'
import AddComment from '../../components/addComment/AddComment'
import CommentsReducer from '../../Reducers/CommentsReducer'
import Card from '../../components/commentCard/Card'

function Replies({comments, imageLink, comment, parentId, userId, isLoggedin, deleteComment, editComment, replyComment, replyTo, j, setCommentScoreNN}){
  j++
  return(
      comment && <li>
          <Card j={j} imageLink={imageLink} setCommentScoreNN={setCommentScoreNN} rating={comment.comment_rating} userId={userId} comment={comment} parentId={parentId} replyTo={replyTo} isLoggedin={isLoggedin} isOwner={isLoggedin ? userId === comment.user.id ? true : false : false} deleteComment={deleteComment} editComment={editComment} replyComment={replyComment}/>
          {comment.replies !== [] &&
              <ul className="replies" style={{paddingLeft: j * 25 + 'px'}}>
                  {comment?.replies.map(reply => (
                      <Replies setCommentScoreNN={setCommentScoreNN} imageLink={imageLink} key={reply} j={j} parentId={comment.id} isLoggedin={isLoggedin} comments={comments} comment={comments?.filter(comment => comment.id === reply)[0]} userId={userId} deleteComment={deleteComment} editComment={editComment} replyComment={replyComment} replyTo={comment.user.username}/>
                  ))}
              </ul>}
      </li>
  )
}

const CommentsPage = () => {

  let initialComments = []
  const [comments, dispatch] = useReducer(CommentsReducer, initialComments);
  let [nextId, setNextId] = useState(-1)
  let {authTokens, logoutUser, user} = useContext(AuthContext)
  let headers = null
  if(authTokens === null){
    headers = {
      'Content-Type': 'application/json'
    }
  }
  else{
    headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authTokens.access
    }
  }
  let getComments = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/comments/', {
          method: 'GET',
          headers: headers
      })

    let data = await response.json()
    if(response.status === 200){
        initialComments = data
        updateComments(initialComments)
    }else if(response.statusText === 'Unauthorized'){
        logoutUser()
    }
  }

  useEffect(()=> {
    getComments()
  }, [])

  let getNextId = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/nextId/', {
          method: 'GET',
          headers: headers
      })

    let data = await response.json()
    if(response.status === 200){
        setNextId(() => data.id)
    }else if(response.statusText === 'Unauthorized'){
        logoutUser()
    }
  }

  useEffect(() => getNextId, [addComment])

  let isLoggedin = authTokens ? true : false

  function updateComments(comments){
    dispatch({
      type: 'updateComments',
      comments: comments
    })
  }

  async function addComment(text) {
    dispatch({
      type: 'add',
      id: nextId,
      text: text,
      user: {
        id: user.user_id,
        image_link: user.image_link,
        username: user.username
      },
      replyId: null
    })
    let response = await fetch('http://127.0.0.1:8000/api/comments/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authTokens.access
      },
      body: JSON.stringify({
        content: text,
        user: user.user_id,
        replying_to: null
      })
    })
    if(response.status === 201)
      console.log('Comment has been created')
    if(response.status === 400)
      console.log('Failed to create the comment')
  }
  
  async function editComment(commentId, newText) {
    dispatch({
      type: 'edit',
      commentId: commentId,
      newText: newText
    })
    let response = await fetch('http://127.0.0.1:8000/api/comment/' + commentId + '/',{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authTokens.access
      },
      body: JSON.stringify({
        id: commentId,
        content: newText
      })
    })
    if(response.status === 206)
      console.log('Comment has been successfully updated')
    if(response.status === 404)
      console.log('Comment doesn\'t exist')
  }
  
  async function deleteComment(commentId, parentId) {
    dispatch({
      type: 'delete',
      commentId: commentId,
      parentId: parentId
    })
    let response = await fetch('http://127.0.0.1:8000/api/comment/' + commentId + '/',{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authTokens.access
      }
    })
    if(response.status === 204)
      console.log('Comment has been successfully deleted')
    if(response.status === 404)
      console.log('Comment doesn\'t exist')
  }

  async function replyComment(parentId, text){
    await getNextId()
    dispatch({
      type: 'reply',
      id: nextId,
      text: text,
      user: {
        id: user.user_id,
        image_link: user.image_link,
        username: user.username
      },
      replyId: parentId
    })
    let response = await fetch('http://127.0.0.1:8000/api/comments/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authTokens.access
      },
      body: JSON.stringify({
        content: text,
        user: user.user_id,
        replying_to: parentId
      })
    })
    if(response.status === 201)
      console.log('Reply has been created')
    if(response.status === 400)
      console.log('Failed to create the reply')
  }
  
  async function setCommentScoreNN(commentId, userId, rating){
    await fetch('http://127.0.0.1:8000/api/score/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authTokens.access
      },
      body: JSON.stringify({
          comment: commentId,
          user: userId,
          rating: rating,
      })
    })
  }
  
  return (
    <>
      <ul className="comments">
        {comments?.filter(comment => comment.replying_to === null).map(comment => {
          let j = 1
          return (
            <li key={comment.id}>
                <Card j={j} imageLink={user?.image_link} parentId={comment.id} setCommentScoreNN={setCommentScoreNN} rating={comment.comment_rating} userId={user?.user_id} comment={comment} isLoggedin={isLoggedin} isOwner={isLoggedin ? user.user_id === comment.user.id ? true : false : false} deleteComment={deleteComment} editComment={editComment} replyComment={replyComment}/>
                {comment.replies !== [] && 
                    <ul className="replies" style={{paddingLeft: j * 25 + 'px'}}>
                        {comment.replies.map(reply => (
                            <Replies imageLink={user?.image_link} setCommentScoreNN={setCommentScoreNN} j={j} key={reply} parentId={comment.id} isLoggedin={isLoggedin} comments={comments} comment={comments?.filter(comment => comment.id === reply)[0]} userId={user?.user_id} deleteComment={deleteComment} editComment={editComment} replyComment={replyComment} replyTo={comment.user.username}/>
                        ))}
                    </ul>}
            </li>
        )})
      }
      </ul>
      <AddComment isLoggedin={isLoggedin} image={isLoggedin ? user.image_link : ''} addComment={addComment}/>
      {isLoggedin &&
        <button className="logout" onClick={event => logoutUser()}><img src={require ('../../images/icon-logout.svg').default} alt=""/> Logout</button>
      }
      <div className="spacing"></div>
    </>
  )
}

export default CommentsPage