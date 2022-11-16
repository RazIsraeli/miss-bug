const fs = require('fs')
const Cryptr = require('cryptr')
const cryptr = new Cryptr('secret-bugs')
const gUsers = require('../data/user.json')

module.exports = {
  save,
  checkLogin,
  getLoginToken,
}

function save(user) {
  if (!user) return Promise.reject("can't create user...")
  if (user._id) {
    //update existing user
    const idx = gUsers.findIndex((currUser) => currUser._id === user._id)
    gUsers[idx] = user
  } else {
    //create a new user
    user._id = _makeId()
    gUsers.unshift(user)
  }
  //return a minified user with fields to expose
  return _saveUsersToFile().then(() => ({
    _id: user._id,
    fullName: user.fullName,
  }))
}

function checkLogin({ username, password }) {
  var user = gUsers.find((user) => {
    return user.username === username && user.password === password
  })
  if (user) {
    user = { _id: user._id, fullName: user.fullName, username: user.username }
    return Promise.resolve(user)
  } else return Promise.reject('wrong credentials...')
}

function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user))
}

function _saveUsersToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gUsers, null, 2)

    fs.writeFile('data/user.json', data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function _makeId(length = 4) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return 'u' + txt
}
