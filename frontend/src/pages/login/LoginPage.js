import React from 'react'
import { useContext, useState} from 'react'
import AuthContext from '../../contextes/AuthContext'
import './loginPage.css'
import userIcon from '../../images/icon-user.svg'
import passwordIcon from '../../images/icon-password.svg'

const LoginPage = () => {

  let [userFocus, setUserFocus] = useState(false)
  let [passwordFocus, setPasswordFocus] = useState(false)

  let {loginUser, isAuth} = useContext(AuthContext)

  return (
    <form className="login-form" onSubmit={loginUser}>
      <div className={'input-field ' + (userFocus ? 'focus' : '')}>
        <img src={userIcon} alt="user icon" />
        <input type="text" name="username" placeholder="Username" onFocus={() => setUserFocus(true)} onBlur={() => setUserFocus(false)}/>
      </div>
      <div className={'input-field ' + (passwordFocus ? 'focus' : '')}>
        <img src={passwordIcon} alt="password icon" />
        <input type="password" name="password" placeholder="Password" onFocus={() => setPasswordFocus(true)} onBlur={() => setPasswordFocus(false)}/>
      </div>
      {isAuth === false &&
        <div className="error-msg">Wrong username or password !</div>} 
      <input type="submit" className="submit-btn" value="Login"/>
    </form>
  )
}

export default LoginPage