const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.getElementById('data-panel')
const data = []

// Search
const searchBtn = document.getElementById('submit-search')
const searchInput = document.getElementById('search')

// Pagination
const pagination = document.getElementById('pagination')
const ITEM_PER_PAGE = 15
let paginationData = []

// Cutover
const cutover = document.getElementById("cutover");
// Judge card or list
let isListMode = false
// 共用的變數，預設為第一頁
let page = 1

// get data by Axois
axios.get(INDEX_URL)
  .then((response) => {
    data.push(...response.data.results)
    // displayDataList(data)
    getTotalPages(data)
    getPageData(1, data)
  })
  .catch(err => consonle.log(err))

// disply selected item
function displaySelected(event, item, num) {
  const activeItem = event.target
  for (let i = 0; i < num; i++) {
    item[i].classList.remove('active')
  }
  activeItem.classList.add('active')
}

// display card
function displayDataList(data) {
  let htmlContent = ''
  if (isListMode === false) {
    data.forEach((item) => {
      htmlContent += `
        <div class="card" >
          <img class="card-img-top pointer" src="${item.avatar}" alt="Card image cap" data-id="${item.id}" data-toggle="modal" data-target="#exampleModal">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">
              <i class="fas fa-heart"></i>
            </button>
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
              <td><button class = "btn btn-info btn-add-favorite" data-id ="${item.id}">
                <i class="fas fa-heart"></i>
              </button></td>
            </tr>
          </table>
        </div> 
      `
    })
  }
  dataPanel.innerHTML = htmlContent
}

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

function addFavoriteItem(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = data.find(item => item.id === Number(id))

  if (list.some(item => item.id === Number(id))) {
    alert(`${user.name} is already in your favorite list.`)
  } else {
    list.push(user)
    alert(`Added ${user.name} to your favorite list!`)
  }
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

// display pagination
function getTotalPages(data) {
  let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
  let pageItemContent = ''
  for (let i = 0; i < totalPages; i++) {
    pageItemContent += `
      <li class="page-item">
        <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li>
    `
  }
  pagination.innerHTML = pageItemContent
}

function getPageData(pageNum, data) {
  paginationData = data || paginationData
  let offset = (pageNum - 1) * ITEM_PER_PAGE
  let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
  displayDataList(pageData)
}

function removeActivePage() {
  let pageItem = document.querySelectorAll('.page-item')
  for (item of pageItem) {
    item.classList.remove('active')
  }
}

// listen to data panel
dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.card-img-top')) {
    showUser(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addFavoriteItem(event.target.dataset.id)
  }
})

// listen to search btn click event
searchBtn.addEventListener('click', event => {
  let results = []
  event.preventDefault()

  const regex = new RegExp(searchInput.value, 'i')
  results = data.filter(users => users.name.match(regex))
  console.log(results)
  // displayDataList(data)
  getTotalPages(results)
  getPageData(1, results)
})

// listen to pagination click event
pagination.addEventListener('click', event => {
  removeActivePage()
  page = event.target.dataset.page;
  if (event.target.tagName === 'A') {
    event.target.closest('.page-item').classList.add('active')
    getPageData(page)
  }
})

// listen to cutover
cutover.addEventListener('click', (event) => {
  if (event.target.matches("#btn-list")) {
    isListMode = true
    getPageData(page)
  } else if (event.target.matches("#btn-card")) {
    isListMode = false
    getPageData(page);
  }
})