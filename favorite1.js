const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.getElementById('data-panel')
const data = JSON.parse(localStorage.getItem('favoriteUsers')) || []

// Cutover
const cutover = document.getElementById("cutover");
// Judge card or list
let isListMode = false
// 共用的變數，預設為第一頁
let page = 1

function displayDataList(data) {
  let htmlContent = ''
  if (isListMode === false) {
    data.forEach((item) => {
      htmlContent += `
        <div class="card" >
          <img class="card-img-top pointer" src="${item.avatar}" alt="Card image cap" data-toggle="modal" data-target="#exampleModal" data-id="${item.id}">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <button class = "btn btn-danger btn-remove-favorite" data-id="${item.id}"> X </button>
          </div>
        </div>    
      `
    })
  } else if (isListMode === true) {
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="card">
          <table class="table">
            <tr>
              <td class="card-img-top" data-id="${item.id}" data-toggle="modal" data-target="#exampleModal">${item.name} ${item.surname}</td>
              <td><button class="btn btn-danger btn-remove-favorite" data-id="${item.id}"> X </button></td>
            </tr>
          </table>
        </div> 
      `
    })
  }
  dataPanel.innerHTML = htmlContent
}

displayDataList(data)

function showUser(id) {
  // get elements
  const modalTitle = document.getElementById('show-user-title')
  const modalImage = document.getElementById('show-user-image')
  const modalDescription = document.getElementById('modal-description')

  // set request url
  const url = INDEX_URL + id
  console.log(url)

  // send request to show api
  axios.get(url)
    .then((response) => {
      const data = response.data
      console.log(data)

      // display data into modal ui
      modalTitle.textContent = data.name + ' ' + data.surname
      modalImage.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="Responsive image">`
      modalDescription.innerHTML = `
        <p>Birthday at : ${data.birthday}</p>
        <p>Age at : ${data.age}</p>
        <br>
        <p>Place of residence : ${data.region}</p>
        <p>Email : ${data.email}</p>
      `
    })
    .catch(err => console.log(err))
}

function removeFavoriteItem(id) {
  // find movie by id
  const index = data.findIndex(item => item.id === Number(id))
  if (index === -1) return

  // removie movie and update localStorage
  data.splice(index, 1)
  localStorage.setItem('favoriteUsers', JSON.stringify(data))

  // repaint dataList
  displayDataList(data)
}

dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.card-img-top')) {
    showUser(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFavoriteItem(event.target.dataset.id)
  }
})