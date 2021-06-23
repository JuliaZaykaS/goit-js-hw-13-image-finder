const debounce = require('lodash.debounce');

import css from './css/style.css';
import ImagesAPIService from './apiService';
import { refs } from './js/refs';
import { myStack1, myStack2, getError, getNotice } from './js/notifications';
import { openModal } from './js/modal.js';
import { renderGallery } from './js/renderGallery';
import { clearMarkupForNewImages } from './js/clearMarkup';


const imagesAPIService = new ImagesAPIService();

infinityScroll(fetchAndRender, getNotice);

refs.formEl.addEventListener('input', debounce(onInputChange, 1500));


function onInputChange(e) {
  e.preventDefault();

  imagesAPIService.query = e.target.value;

  if (imagesAPIService.query === '') {
    clearMarkupForNewImages();
    return;
  }
  imagesAPIService.resetPage();
  clearMarkupForNewImages();
  fetchAndRender();
  getNotice(myStack1);
}


function fetchAndRender() {
  imagesAPIService
  .fetchImages()
  .then(images => {
      if (images.hits.length === 0) {
      getError();
    }
    renderGallery(images);
    return images;
  })
  .then(data => {
    openModal(data);
  })
    .catch(getError)
    .finally(() => {
      refs.scrollPointEl.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    });
}



function infinityScroll(render, notice) {
  const options = {
    rootMargin: '50px',
    threshold: 0.5,
  };
  const onEntry = entries => {
    if (entries[0].intersectionRatio <= 0) return;

    if (imagesAPIService.query === '') {
      clearMarkupForNewImages();
      return;
    }
    render();
    notice(myStack2);
  };

  const observer = new IntersectionObserver(onEntry, options);

  observer.observe(refs.hiddenPointEl);
}

// если делать кнопку загрузить больше
// refs.buttonEl.addEventListener('click', e => {
  //   imagesAPIService.query = e.target.value;
  //   if (imagesAPIService.query === '') {
//     clearMarkupForNewImages();
//     return;
//   }
//   // checkEmptyRequest();
//   fetchAndRender();
// });






