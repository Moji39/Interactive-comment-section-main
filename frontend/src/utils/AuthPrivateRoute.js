import React, { useContext } from 'react'
import AuthContext from '../contextes/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AuthPrivateRoute({children}) {
  
  let {user} = useContext(AuthContext)

  return (
    user !== null ? <Navigate to="/" replace/> : children
  )
}
