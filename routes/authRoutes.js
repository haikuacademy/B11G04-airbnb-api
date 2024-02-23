import { Router } from 'express'
import db from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { secret } from '../secrets.js'

const router = Router()
// sign up
router.post('/signup', async (req, res) => {
  try {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const password = req.body.password
    const profile_photo = req.body.profile_photo
    // create salt
    const salt = await bcrypt.genSalt(10)
    // Hashing password
    const hashedPassword = await bcrypt.hash(password, salt)
    const queryString = ` INSERT INTO users ( first_name, last_name, email, password, profile_photo) 
    VALUES ('${first_name}', '${last_name}', '${email}', '${hashedPassword}', '${profile_photo}' )
  RETURNING * `
    console.log(queryString)
    const { rows } = await db.query(queryString)
    res.json(rows)
  } catch (err) {
    res.json({ error: err.message })
  }
})
//login coding
router.post('/login', async (req, res) => {
  // searching for login
  console.log(req.body)
  try {
    const { rows } = await db.query(
      `SELECT * FROM users WHERE email = '${req.body.email}'`
    )
    // console.log(rows[0])

    let user = rows[0]
    console.log(rows)

    if (!user) {
      throw new Error('Email not valid')
    }
    console.log(user)
    //compares password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    )
    // console.log(isPasswordValid)
    if (isPasswordValid) {
      res.send('Your login is correct')
    } else {
      throw new Error('Your login is incorrect')
    }
    const payload = {
      user_id: req.body.user_id,
      email: req.body.email
    }
    const token = jwt.sign(payload, secret)
    const decoded = jwt.verify(token, secret)
    res.cookie('jwt, token')
  } catch (err) {
    res.json({ error: err.message })
  }
})
// logout
router.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.send('You are logged out')
})

export default router
