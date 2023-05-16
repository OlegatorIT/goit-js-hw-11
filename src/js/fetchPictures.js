import axios from 'axios';
const API_KEY = '36237368-27c288b102faa19f6ad3c6cec';
const BASE_URL = 'https://pixabay.com/api/';

export class FetchPictures {
  options = {
    params: {
      key: `${API_KEY}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    },
  };
  constructor() {
    this.page = 1;
    this.value = '';
  }

  async fetchPictures() {
    const response = await axios.get(
      `${BASE_URL}?q=${this.value}&page=${this.page}`,
      this.options
    );
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  message = {
    try_again:
      'Sorry, there are no images matching your search query. Please try again.',
  };

  hide(el) {
    !el.classList.contains('hide') && el.classList.add('hide');
  }

  show(el) {
    el.classList.contains('hide') && el.classList.remove('hide');
  }

  amountImg(box) {
    return box.children.length;
  }

  createMarkup(arr) {
    const arrImg = [];

    arr.forEach(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        arrImg.push(
          `<div class="photo-card">
       <a class="photo-link" href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
    </div>`
        )
    );

    return arrImg.join('');
  }
}
