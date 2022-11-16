//Port
const PORT = process.env.PORT || 3030

// Node modules
const express = require('express')
const cookieParser = require('cookie-parser')

// Services
const bugService = require('./services/bug.service')
const pdfService = require('./services/pdf.service')
const userService = require('./services/user.service')

// Express app
const app = express()

// Express config
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

//Express Routing

//BUG ENDPOINTS
//Export bugs
app.get('/api/bug/download', (req, res) => {
  const filterBy = req.query
  bugService
    .query(filterBy)
    .then(({ filteredBugs }) => res.send(pdfService.exportBugs(filteredBugs)))
})

// LIST
app.get('/api/bug', (req, res) => {
  const { title, severity, page } = req.query

  const filterBy = {
    title: title || '',
    severity: +severity || 0,
    page: +page || 0,
  }
  bugService.query(filterBy).then((bugs) => res.send(bugs))
})

//READ
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  //cookies
  let visitedBugs = req.cookies.visitedBugs || []
  if (visitedBugs.length >= 3) return res.status(401).send('wait for a bit...')
  if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

  res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
  //sending back the bugId to the frontend
  bugService.getById(bugId).then((bug) => res.send(bug))
})

//ADD
app.post('/api/bug/', (req, res) => {
  const { title, severity, description, creator, createdAt } = req.body
  const bug = {
    title,
    description,
    severity,
    creator,
    createdAt,
  }
  bugService.save(bug).then((newBug) => res.send(newBug))
})

//UPDATE
app.put('/api/bug/:bugId', (req, res) => {
  const { _id, title, severity, description, creator, createdAt } = req.body
  const bug = {
    _id,
    title,
    severity,
    description,
    creator,
    createdAt,
  }
  bugService.save(bug).then((savedBug) => res.send(savedBug))
})

//DELETE
app.delete('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  console.log(req.body)
  console.log('_id: ', _id)
  bugService.remove(bugId).then(() => res.send('bug removed!'))
})

//USER ENDPOINTS
//SIGNUP
app.post('/api/auth/signup', (req, res) => {
  const { username } = req.body
  if (!username) return res.status(401).send('missing details')
  // const { username, fullName, password } = req.body
  // const user = {
  //   username,
  //   fullName,
  //   password,
  // }
  // if (user)
  userService
    .save(req.body)
    .then((user) => {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    })
    .catch((err) => res.send(err))
})

//LOGIN
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  const user = {
    username,
    password,
  }
  userService
    .checkLogin(user)
    .then((user) => {
      if (user) {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
      } else res.status(400).send('invalid credentials...')
    })
    .catch((err) => {
      console.log(err)
      res.status(400).send(err)
    })
})

//LOGOUT
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('logged out from miss bugs')
})

//Server Init
app.listen(PORT, () => console.log(`Server is ready at port ${PORT}`))
