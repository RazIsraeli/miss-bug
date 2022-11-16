import { eventBus, showSuccessMsg, showErrorMsg } from './eventBus.service.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

// signup({ fullName: 'Raz Israeli', username: 'Razis', password: 'razis' })

export const userService = {
  signup,
  login,
  getLoggedInUser,
  logout,
}

function signup({ username, password, fullName }) {
  return axios
    .post('/api/auth/signup', { username, password, fullName })
    .then((res) => res.data)
    .then((user) => {
      return _setLoggedInUser(user)
    })
}
function login({ username, password }) {
  return axios
    .post('/api/auth/login', { username, password })
    .then((res) => res.data)
    .then((user) => {
      return _setLoggedInUser(user)
    })
    .catch((err) => {
      showErrorMsg(err.response.data)
    })
}
function getLoggedInUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function logout() {
  return axios
    .post('/api/auth/logout')
    .then((res) => res.data)
    .then(() => {
      sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    })
}

function _setLoggedInUser(user) {
  const userToSave = {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
  return userToSave
}
