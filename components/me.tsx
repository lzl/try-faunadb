import React, { useEffect } from 'react'
import faunadb from 'faunadb'

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

  return (
    <a href="https://lzl.dev/">
      <div className="text-6xl font-bold">LZL</div>
    </a>
  )
}
