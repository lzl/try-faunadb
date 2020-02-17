import { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'

const LoginPage: NextPage = () => {
  const router = useRouter()
  const { code } = router.query

  useEffect(() => {
    if (code) {
      ;(async () => {
        const res = await fetch(`/api/oauth/google?code=${code}`)
        const data = await res.json()
        localStorage.setItem('authToken', data.authToken)
        router.push('/')
      })()
    }
  }, [code])

  return <div>loading</div>
}

export default LoginPage
