import '@pnotify/core/dist/BrightTheme.css';
const { defaults } = require('@pnotify/core');
const { error , notice, Stack } = require('@pnotify/core');
const debounce = require('lodash.debounce');
// const basicLightbox = require('basiclightbox');
import * as basicLightbox from 'basiclightbox';


import galleryMarkup from './templates/gallery.hbs';
import css from './css/style.css';
import ImagesAPIService from './apiService';

const refs = {
  buttonEl: document.querySelector('#load-more-btn'),
  formEl: document.querySelector('#search-form'),
  listEl: document.querySelector('.gallery'),
  scrollPointEl: document.getElementById('gallery-container'),
  // hiddenPointEl: document.getElementById('hidden-point'),
};

// const instance = basicLightbox.create(`
//     <img src="assets/images/image.png" width="800" height="600">
// `)

// instance.show()

const myStack = new Stack({
  dir1: 'down',
  dir2: 'left',
  firstpos1: 25,
  firstpos2: 25,
  spacing1: 36,
  spacing2: 36,
  push: 'bottom',
  context: refs.formEl
});


const imagesAPIService = new ImagesAPIService();
// console.log(imagesAPIService);








function renderGallery(array) {
  refs.listEl.insertAdjacentHTML('beforeend', galleryMarkup(array));
}

refs.formEl.addEventListener('input', debounce(onInputChange, 1500));
console.log(imagesAPIService);

function onInputChange(e) {
  e.preventDefault();
  imagesAPIService.query = e.target.value;
  // console.log(e.target.value);
  // console.log(imagesAPIService.query);
  if (imagesAPIService.query === '') {
    clearMarkupForNewImages();
    return;
  }
  // checkEmptyRequest();
  console.log(imagesAPIService)
  imagesAPIService.resetPage();
  clearMarkupForNewImages();
  fetchAndRender();
  // imagesAPIService.incrementPage();
  // scroll();
}

function fetchAndRender() {

  imagesAPIService
    .fetchImages()
    .then(images => {
      console.log(images);
      getNotice();
      renderGallery(images);
      return images;

    })
    .then((data)=> {
      console.log(data);
      console.log(data.hits);
      openModal(data);

    })
    .catch(getError)
    .finally(() => {
    refs.scrollPointEl.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
  })


}

// refs.buttonEl.addEventListener('click', onBtnClick);
refs.buttonEl.addEventListener('click', (e) => {
  imagesAPIService.query = e.target.value;
  if (imagesAPIService.query === '') {
    clearMarkupForNewImages();
    return;
  }
  // checkEmptyRequest();
  fetchAndRender();
});

// function onBtnClick(e) {
//     if (refs.formEl.elements.query.value === '') {
//         // page = API.page;
//     return;
//   }
//   // page += 1;
//   // console.log(page);
//   // scroll();
//   fetchAndRender(refs.formEl.elements.query.value, page, API.perPage);

// }

function clearMarkupForNewImages() {
  refs.listEl.innerHTML = '';
  // page = API.page;
}


function getError() {
const myError = error({
  text: "Ooops, something went wrong",
  stack: myStack
});
}

function getNotice() {
  const myNotice = notice({
    text: "Please wait, loading...",
    stack: myStack
});

}


function openModal(data) {
  const arrayOfLargeURL = data.hits.map((elem) => {
        return {
          src: elem.webformatURL,
          largeUrl: elem.largeImageURL
        };
    })
    // console.log(arrayOfLargeURL);
      refs.listEl.addEventListener('click', (e) => {

        if (!e.target.classList.contains('image')) return;

        // console.log(e.target);
        const findUrl = arrayOfLargeURL.find((elem) => {
          if (elem.src === e.target.src) {
            // console.log(elem.largeUrl);
            return elem.largeUrl;
          }
        })
        // console.log(findUrl.largeUrl);
    const instance = basicLightbox.create(
      `<img src = "${findUrl.largeUrl}">`
    )
    instance.show();
  }
  )
}

// function checkEmptyRequest() {
//   // imagesAPIService.query = e.target.value;
//   if (imagesAPIService.query === '') {
//     clearMarkupForNewImages();
//     return;
//   }

// }