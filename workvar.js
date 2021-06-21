import galleryMarkup from './templates/gallery.hbs';
import css from './css/style.css';
const debounce = require('lodash.debounce');
import API from './apiService';

const refs = {
  buttonEl: document.querySelector('#load-more-btn'),
  formEl: document.querySelector('#search-form'),
  listEl: document.querySelector('.gallery'),
  // hiddenPointEl: document.getElementById('hidden-point'),
};

// function scroll() {
//   document.getElementById("hidden-point").scrollIntoView({
//   behavior: 'smooth',
//   block: 'end',
//   })

// //   document.body.insertAdjacentHTML('beforeend', '<div id="hidden-point"></div>')
// //   const hiddenPointEl= document.getElementById('hidden-point')
// //  hiddenPointEl.scrollIntoView({
// //   behavior: 'smooth',
// //   block: 'end',
// //   });

// }


function renderGallery(array) {
  // const gallery = galleryMarkup(array);
  refs.listEl.insertAdjacentHTML('beforeend', galleryMarkup(array));
}

refs.formEl.addEventListener('input', debounce(onInputChange, 1500));
let page = API.page;

function onInputChange(e) {
  e.preventDefault();
  const searchQuery = e.target.value;
    if (searchQuery === '') {
        // page = API.page;
    clearMarkupForNewImages();
    return;
  }
  clearMarkupForNewImages();
  fetchAndRender(searchQuery);
  scroll();

}

function fetchAndRender(searchQuery, page, perPage) {
  const data = API.fetchImages(searchQuery, page, API.perPage);

  data.then(result => {
    console.log(result);
    return renderGallery(result);
  });
}

refs.buttonEl.addEventListener('click', onBtnClick);

function onBtnClick(e) {
    if (refs.formEl.elements.query.value === '') {
        page = API.page;
    return;
  }
  page += 1;
  console.log(page);
  scroll();
  fetchAndRender(refs.formEl.elements.query.value, page, API.perPage);

}

function clearMarkupForNewImages() {
  refs.listEl.innerHTML = '';
  page = API.page;
}
