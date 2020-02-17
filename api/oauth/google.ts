import queryString from 'query-string'
import fetch from 'isomorphic-unfetch'
import faunadb from 'faunadb'

const isDev = process.env.NODE_ENV === 'development'

async function getTokenFromCode(code) {
  const body = {
    client_id:
      '454270118201-1f8r5ifmo5rudmdrb2ch887c99962d7u.apps.googleusercontent.com',
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirect_uri: isDev
      ? 'http://localhost:3000/login/google'
      : 'https://try-faunadb.now.sh/login/google',
    grant_type: 'authorization_code',
    code,
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json() // { access_token, expires_in, token_type, refresh_token }
  return data
}

async function getUserInfo(access_token) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  const data = await res.json() // { id, email, given_name, family_name }
  return data
}

export default async (req, res) => {
  try {
    const { code } = req.query
    if (code) {
      const token = await getTokenFromCode(code)
      console.log('token:', token)
      const profile = await getUserInfo(token.access_token)
      console.log('profile:', profile)

      const secret = process.env.FAUNADB_SECRET_KEY
      const q = faunadb.query
      const client = new faunadb.Client({ secret })
      const authToken = await client.query(
        q.Let(
          {
            setRef: q.Match(q.Index('accounts_by_email'), profile.email),
            object: q.Get(q.Var('setRef')),
            ref: q.Select(['ref'], q.Var('object')),
            hasAccount: q.Exists(q.Var('setRef')),
            accountRef: q.If(
              q.Var('hasAccount'),
              q.Select(
                ['ref'],
                q.Update(q.Var('ref'), {
                  data: { google_profile: profile, google_token: token },
                })
              ),
              q.Select(
                ['ref'],
                q.Create(q.Collection('accounts'), {
                  data: {
                    email: profile.email,
                    google_profile: profile,
                    google_token: token,
                  },
                })
              )
            ),
            authToken: q.Select(
              ['secret'],
              q.Create(q.Tokens(), { instance: q.Var('accountRef') })
            ),
          },
          q.Var('authToken')
        )
      )
      console.log('authToken:', authToken)
      res.status(200).json({ authToken })
    } else {
      res.status(200).json({ ok: true })
    }
  } catch (err) {
    console.log(err)
    res.status(404).json({ statusCode: 404, message: err.message })
  }
}
