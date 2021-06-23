import { refs } from './refs';
import galleryMarkup from '../templates/gallery.hbs';

export function renderGallery(array) {
  refs.listEl.insertAdjacentHTML('beforeend', galleryMarkup(array));
}