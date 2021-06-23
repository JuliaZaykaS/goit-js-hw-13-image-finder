import { refs } from './refs';

export function clearMarkupForNewImages() {
  refs.listEl.innerHTML = '';
}