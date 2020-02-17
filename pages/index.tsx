import React, { useState, useEffect } from 'react'
import Me from '../components/me'
import LoginWithGoogleButton from '../components/LoginWithGoogleButton'

export default () => {
  const [token, setToken] = useState()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) setToken(token)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      {token ? <Me secret={token} /> : <LoginWithGoogleButton />}
    </div>
  )
}
