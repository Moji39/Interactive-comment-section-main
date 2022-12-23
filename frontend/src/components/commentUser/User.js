import React from 'react'
import './User.css'

export default function User({user, isOwner, createdSince}) {

    let dates = createdSince.split(" "), date
    for(let i = 0; i < dates.length; i++){
        if(dates[i].substr(0, dates[i].length - 1) != 0){
            let plural = '', t = '';
            if(dates[i].substr(0, dates[i].length - 1) > 1) plural = 's'
            switch(dates[i].substr(dates[i].length - 1, dates[i].length)){
                case 'y': 
                    t = 'year'
                    break
                case 'm': 
                    t = 'month'
                    break
                case 'w': 
                    t = 'week'
                    break
                case 'd': 
                    t = 'day'
                    break
                case 'h': 
                    t = 'hour'
                    break
                case 'i': 
                    t = 'minute'
                    break
                case 's': 
                    t = 'second'
                    break
            }
            date = dates[i].substr(0, dates[i].length - 1) + ' ' + t + plural + ' ago';
            break;
        }
    }

    return (
        <div className="top">
            <img src={require ('../../images/avatars/image-' + user.image_link)} alt="" />
            <p>{user.username} {isOwner && <span className="you">you</span>}</p>
            <p className="created-since">{date}</p>
        </div>
    )
}