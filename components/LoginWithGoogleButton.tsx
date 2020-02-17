import React from 'react'
import queryString from 'query-string'

const isDev = process.env.NODE_ENV === 'development'

function LoginButton() {
  const params = queryString.stringify({
    client_id:
      '454270118201-1f8r5ifmo5rudmdrb2ch887c99962d7u.apps.googleusercontent.com',
    redirect_uri: isDev
      ? 'http://localhost:3000/login/google'
      : 'https://try-faunadb.now.sh/login/google',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    // prompt: 'consent',
  })

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`

  return (
    <a href={url}>
      <button>使用 Google 账号登录</button>
    </a>
  )
}

export default LoginButton
