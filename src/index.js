import '@pnotify/core/dist/BrightTheme.css';
const { defaults } = require('@pnotify/core');
const { error , notice, Stack } = require('@pnotify/core');
const debounce = require('lodash.debounce');
const basicLightbox = require('basiclightbox');
// import * as basicLightbox from 'basiclightbox';


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
      getNotice();
      const gallery = renderGallery(images);
      return images;


      // const arrayOfImages = document.querySelectorAll('.image');
      // console.log(arrayOfImages);
      // [...arrayOfImages].addEventListener('click')
      // console.log([...arrayOfImages[0]].children.img);

      // return gallery;
    })
    .then((data)=> {
      console.log(data);
      console.log(data.hits);

      // console.log(data.hits.largeImageURL);
      const arrayOfLargeURL = data.hits.map((elem) => {
        return {
          src: elem.webformatURL,
          largeUrl: elem.largeImageURL
        };
    })
    console.log(arrayOfLargeURL);
      refs.listEl.addEventListener('click', (e) => {
        // if (![...data.hits.webformatURL].includes(e.target.src)) return;
        if (!e.target.classList.contains('image')) return;

        console.log(e.target);
        const findUrl = arrayOfLargeURL.find((elem) => {
          if (elem.src === e.target.src) {
            console.log(elem.largeUrl);
            return elem.largeUrl;
          }
        })
        console.log(findUrl.largeUrl);
//         const instance = basicLightbox.create(`
//     <div class="modal">
//         <img src = "${findUrl.largeUrl}">
//     </div>
// `)

    //     const imageClick = [...data.hits.webformatURL].indexOf(e.target.src);
    //     console.log(imageClick);
    // const urlImg = [...data.hits.largeImageURL][imageClick];
    // console.log(urlImg);
    const instance = basicLightbox.create(
      `<img src = "${findUrl.largeUrl}">`
    )
    instance.show();

  }
  )
      // console.log(data.hits[0].largeImageURL);
      // openModal(data)
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

// refs.listEl.addEventListener('click', onImageClick);

// function onImageClick(e) {
//   if (!e.target.classList.contains('photo-card')) return;
//   console.log(e.target);
//   const instance = basicLightbox.create(`
//     <img src="${data.hits.largeImageURL}">
// `)
//   // return instance;
//   instance.show()
// }

function openModal(data) {
  refs.listEl.addEventListener('click', (e) => {
    if (!e.target.classList.contains('photo-card')) return;
    console.log(e.target);
    const imageClick = e.target;
    const urlImg = imageClick.hits.largeImageURL;
    console.log(urlImg);
    const instance = basicLightbox.create(
      `<img src = "urlImg">`
    )
    instance.show();

  }
  )
}