import { Router } from 'express'
import db from '../db.js'
import bcrypt from 'bcrypt'
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
  const { rows } = await db.query(`SELECT * FROM users `)
})
// logout
router.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.send('You are logged out')
})

export default router
