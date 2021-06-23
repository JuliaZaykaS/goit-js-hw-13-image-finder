const BASE_URL = 'https://pixabay.com/api/';
const KEY = '22169948-cc9572b9e3579c1f2dd268170';

// вариант на классе
export default class ImagesAPIService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 12;
  }

  fetchImages() {
    const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}&key=${KEY}`;

    return fetch(url)
      .then(response => {

        return response.json()
      })
      .then((images) => {

        this.incrementPage();
        return images;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get quantityPerPage() {
    return this.perPage;
  }

  set quantityPerPage(newPerPage) {
    this.perPage = newPerPage;
  }
}
