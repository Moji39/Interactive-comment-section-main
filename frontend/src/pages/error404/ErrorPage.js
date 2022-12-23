import React from 'react'
import './errorPage.css'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div className='error'>
      <h1>Error404 : </h1>
      <p>The page you were looking for does not exist</p>
      <Link to="/">Comments Page</Link>
    </div>
  )
}

export default ErrorPage