// server bug service
const fs = require('fs')
const gBugs = require('../data/bug.json')

module.exports = {
  query,
  getById,
  remove,
  save,
}

const itemsPerPage = 6

function query(filterBy) {
  const { title, page, severity } = filterBy

  const regex = new RegExp(title, 'i')
  let filteredBugs = gBugs.filter(
    (bug) => regex.test(bug.title) || regex.test(bug.description)
  )
  filteredBugs = filteredBugs.filter((bug) => bug.severity <= severity)

  const startIdx = page * itemsPerPage
  const totalPages = Math.ceil(filteredBugs.length / itemsPerPage)
  filteredBugs = filteredBugs.slice(startIdx, startIdx + itemsPerPage)
  return Promise.resolve({ totalPages, filteredBugs })
}

function getById(bugId) {
  const bug = gBugs.find((bug) => bug._id === bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {
  const idx = gBugs.findIndex((bug) => bug._id === bugId)
  if (idx < 0) return Promise.reject('bug does not exist...')
  gBugs.splice(idx, 1)
  return _saveBugsToFile()
}

function save(bug) {
  if (bug._id) {
    //update existing bug
    const idx = gBugs.findIndex((currBug) => currBug._id === bug._id)
    gBugs[idx] = bug
  } else {
    //create new bug
    bug._id = _makeId()
    bug.createdAt = Date.now()
    gBugs.unshift(bug)
  }
  return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gBugs, null, 2)

    fs.writeFile('data/bug.json', data, (err) => {
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
  return 'b' + txt
}
