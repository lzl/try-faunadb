import React, { useEffect } from 'react'
import faunadb from 'faunadb'

declare const Paddle

export default function Me({ secret }) {
  useEffect(() => {
    if (!secret) return
    ;(async () => {
      try {
        const q = faunadb.query
        const client = new faunadb.Client({ secret })
        const result = await client.query(q.Get(q.Identity()))
        console.log('me:', result)
      } catch (error) {
        console.log('error:', error)
      }
    })()
  }, [])

  useEffect(() => {
    Paddle.Setup({ vendor: 108756 })
  }, [])

  function checkout() {
    Paddle.Checkout.open({
      product: 584338,
      email: 'lizunong@gmail.com',
      marketingConsent: '1',
      passthrough: localStorage.getItem('authToken'),
    })
    console.log(Paddle)
  }

  return (
    <div className="text-6xl font-bold" onClick={checkout}>
      LZL
    </div>
  )
}
