import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Me from '../components/me'
import LoginWithGoogleButton from '../components/LoginWithGoogleButton'

export default () => {
  const [token, setToken] = useState()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) setToken(token)
  }, [])

  return (
    <>
      <Head>
        <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
      </Head>
      <div className="flex items-center justify-center min-h-screen">
        {token ? <Me secret={token} /> : <LoginWithGoogleButton />}
      </div>
    </>
  )
}
