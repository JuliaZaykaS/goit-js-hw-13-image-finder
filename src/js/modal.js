import * as basicLightbox from 'basiclightbox';
import { refs } from './refs';


export function openModal(data) {
  const arrayOfLargeURL = data.hits.map(elem => {
    return {
      src: elem.webformatURL,
      largeUrl: elem.largeImageURL,
    };
  });
   refs.listEl.addEventListener('click', e => {
    if (!e.target.classList.contains('image')) return;
    arrayOfLargeURL.find(elem => {
      if (elem.src === e.target.src) {
        const instance = basicLightbox.create(`<img src = "${elem.largeUrl}">`);
        instance.show();
      }
    });
  });
}