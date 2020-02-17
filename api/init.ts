import { NowRequest, NowResponse } from '@now/node'
import faunadb from 'faunadb'
import fetch from 'isomorphic-unfetch'

export default async (req: NowRequest, res: NowResponse) => {
  try {
    // lizunlong@gmail.com
    // userId: 257525567624053259
    // tokenId: 257525567626150411
    // profileId: 257578845228499465
    // secret: fnEDkuojqvACCwOS4SgIoAIBbimXe-tCrKtTHX4bcqg1z1KWUTM

    // genshang@gmail.com
    // userId: 257526359023157760
    // tokenId: 257526359025254912
    // profileId: 257601596347646466
    // secret: fnEDkurb7gACAAOS4SgIoAIBunY4ytLNre7Dujim2uO9MyGY5hc

    const secret = process.env.FAUNADB_SECRET_KEY
    // const secret = 'fnEDkuojqvACCwOS4SgIoAIBbimXe-tCrKtTHX4bcqg1z1KWUTM' // lizunlong@gmail.com
    // const secret = 'fnEDkurb7gACAAOS4SgIoAIBunY4ytLNre7Dujim2uO9MyGY5hc' // genshang@gmail.com

    const q = faunadb.query
    const client = new faunadb.Client({ secret })

    const data = JSON.parse(req.body)

    // res.status(200).json(result)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.log(err)
    res.status(404).json({ statusCode: 404, message: err.message })
  }
}
