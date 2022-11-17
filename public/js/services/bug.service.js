export const bugService = {
  query,
  getById,
  remove,
  save,
  getEmptyBug,
  downloadList,
}

const BASE_URL = '/api/bug/'

function query(filterBy) {
  return axios.get(BASE_URL, { params: filterBy }).then((res) => res.data)
}

function getById(bugId) {
  return axios.get(BASE_URL + bugId).then((res) => res.data)
}
//! REFACTOR THE FUNCTIONS THAT CHANGE BUGS TO DO THE VALIDATIONS ON THE BACKEND USING THE COOKIE (validateToken)
function remove(bugId, user) {
  return getById(bugId).then((bug) => {
    if (bug.creator._id !== user._id) {
      return Promise.reject("can't remove bugs that someone else created!")
    } else return axios.delete(BASE_URL + bugId).then((res) => res.data)
  })
}

function save(bug, user) {
  const { _id, username } = user

  if (bug._id) {
    if (bug.creator._id !== _id)
      return Promise.reject("can't update bugs that were not created by you")
    return axios.put(BASE_URL + bug._id, bug).then((res) => res.data)
  } else {
    bug.creator = {
      _id,
      username,
    }
    return axios.post(BASE_URL, bug).then((res) => res.data)
  }
}

function getEmptyBug() {
  return {
    _id: '',
    title: '',
    description: '',
    severity: 0,
    createdAt: '',
  }
}

function downloadList(filterBy) {
  return axios
    .get(BASE_URL + 'download', { params: filterBy })
    .then((res) => res.data)
}
