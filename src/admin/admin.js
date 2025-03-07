//  FarrelConnect Data Server
//  Farrel Corporation © 2025

// import libaries
import express from 'express'
import ip from 'ip'
import jwt from 'jsonwebtoken'

const adminApp = express()
const port = process.env.ADMIN_PORT || 3102;
const users = [
  {
    "username": "jpell3",
    "name": "Justin",
    "age": 29
  },
  {
    "username": "rkoll1",
    "name": "Ray",
    "age": 31
  },
  {
    "username": "akwie2",
    "name": "Albert",
    "age": 27
  }
]
adminApp.use(express.json())

adminApp.get(`/users`, authenticateToken, (req, res) => {
  res.json(users.filter(user => user.name === req.user.name))
});

// landing page
adminApp.get(`/`, (req, res) => {
  res.end(`ADMIN APP:  /`)
});

adminApp.post('/login', (req, res) => {
  // Authenticate
  const name = req.body.name
  const user = { name: name }
  const accessToken = jwt.sign(user, process.env.ADMIN_TOKEN_SECRET)
  res.json({ accessToken: accessToken })
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, (err, user) => {
    if(err) return res.send(403)
    req.user = user
    next()
  })
}

// expose configuration data
adminApp.get(`/config`, (req, res) => {
  res.writeHead(200, { "Content-Type" : 'application/json' });
  res.end(JSON.stringify(data))})

// catch all route
adminApp.get(`*`,(req, res) => {
  res.send(`Sorry, the page ${req.url} does not exist. Please try a different URL.`)
});

adminApp.listen(port, () => {
  console.log(`Admin server listening on port ${port} at http://127.0.0.1:${port} (local) and http://${ip.address()}:${port} (network)`);
});

export default adminApp;