import galleryMarkup from './templates/gallery.hbs';
import css from './css/style.css';
const debounce = require('lodash.debounce');
import ImagesAPIService from './apiService';

const refs = {
  buttonEl: document.querySelector('#load-more-btn'),
  formEl: document.querySelector('#search-form'),
  listEl: document.querySelector('.gallery'),
  scrollPointEl: document.getElementById('gallery-container'),
  // hiddenPointEl: document.getElementById('hidden-point'),
};

const imagesAPIService = new ImagesAPIService();
// console.log(imagesAPIService);

function renderGallery(array) {
  refs.listEl.insertAdjacentHTML('beforeend', galleryMarkup(array));
}

refs.formEl.addEventListener('input', debounce(onInputChange, 1500));

function onInputChange(e) {
  e.preventDefault();
  imagesAPIService.query = e.target.value;
  // console.log(e.target.value);
  // console.log(imagesAPIService.query);
  if (imagesAPIService.query === '') {
    clearMarkupForNewImages();
    return;
  }
  // console.log(imagesAPIService)
  imagesAPIService.resetPage();
  clearMarkupForNewImages();
  fetchAndRender();
  // imagesAPIService.incrementPage();
  // scroll();
}

function fetchAndRender() {
  // const data = imagesAPIService.fetchImages();
  // console.log(data);

  //  console.log(imagesAPIService.fetchImages());
  // .then(console.log)
  imagesAPIService
    .fetchImages()
    .then(images => {
      console.log(images);
      const gallery = renderGallery(images);
      // refs.scrollPointEl.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'end',
      // });
      return gallery;
    })
    .then(
      refs.scrollPointEl.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      }),
    );
}

// refs.buttonEl.addEventListener('click', onBtnClick);
refs.buttonEl.addEventListener('click', fetchAndRender);

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
