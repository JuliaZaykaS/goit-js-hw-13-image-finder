const BASE_URL = 'https://pixabay.com/api/';
const KEY = '22169948-cc9572b9e3579c1f2dd268170';
let page = 1;
const perPage = 12;
// const query = 'horse';
// https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=что_искать&page=номер_страницы&per_page=12&key=твой_ключ

function fetchImages(searchQuery, page, perPage) {
  return fetch(
    `${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=${perPage}&key=${KEY}`,
  ).then(r => {
    // if (!r.ok) return null;

    return r.json();
  });
}

// console.log(fetchImages('horse'));
export default { fetchImages, page ,perPage };


// export default class imagesAPIService {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//   }

//   fetchImages() {
//     const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=${perPage}&key=${KEY}`;

//     return fetch(url, options)
//       .then(response => response.json())
//       .then(({ articles }) => {
//         this.incrementPage();
//         return articles;
//       });
//   }

//   incrementPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }

//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }
// }
