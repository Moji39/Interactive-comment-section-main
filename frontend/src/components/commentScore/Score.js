import React, { useState } from 'react'
import './Score.css'

export default function CommentScore({score, isLoggedin, rating, commentId, userId, setCommentScoreNN}){
    let p, m = false
    if(rating === true)
        p = true
    if(rating === false)
        m = true

    let[commentScore, setCommentScore] = useState(score)
    let[plusClicked, setPlusClicked] = useState(p)
    let[minusClicked, setMinusClicked] = useState(m)

    function plusClick(){
        if(plusClicked){ 
            setCommentScore(--commentScore)
            setCommentScoreNN(commentId, userId, '')
        }
        else{
            if(minusClicked)
                setCommentScore(commentScore += 2)
            else
                setCommentScore(++commentScore)
            setCommentScoreNN(commentId, userId, true)
        }
        setPlusClicked(() => !plusClicked)
        setMinusClicked(() => false)
    }  

    function minusClick(){
        if(minusClicked){
            setCommentScore(++commentScore)
            setCommentScoreNN(commentId, userId, '')
        }    
        else{
            if(plusClicked)
                setCommentScore(commentScore -= 2)
            else
                setCommentScore(--commentScore)
            setCommentScoreNN(commentId, userId, false)
        }
        setMinusClicked(() => !minusClicked)
        setPlusClicked(() => false)
    }        

    return(
        <div className="score-act">
            <button className={plusClicked ? 'green' : ''} disabled={!isLoggedin} onClick={() => plusClick()}><img src={require ('../../images/icon-plus.svg').default} alt="+"/></button>
            <div className={'score ' + (plusClicked ? 'green' : minusClicked ? 'red' : '')}>{commentScore}</div>
            <button className={minusClicked ? 'red' : ''} disabled={!isLoggedin} onClick={() => minusClick()}><img src={require ('../../images/icon-minus.svg').default} alt="-"/></button>
        </div>
    )
}