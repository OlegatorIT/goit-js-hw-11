import { FetchPictures } from './fetchPictures';

// LiBRARIES=====================================================
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

const fetchPictures = new FetchPictures();
const throttledHandleScroll = throttle(handleScroll, 300);
let isLoading = false;
const gallery = new SimpleLightbox('.photo-link');

const searchForm = document.getElementById('search-form');
const boxImg = document.querySelector('.gallery');
const messageTheEnd = document.querySelector('.gallery-text');
const gifEl = document.querySelector('.gif');

searchForm.addEventListener('submit', onSearchContent);

function handleScroll() {
  if (isLoading) return;

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    fetchPicturesMore();
  }
}

function fetchPicturesMore() {
  isLoading = true;

  fetchPictures.show(gifEl);
  fetchPictures.incrementPage();
  fetchPictures
    .fetchPictures()
    .then(data => {
      const imagesArr = data.hits;
      if (data.totalHits === fetchPictures.amountImg(boxImg)) {
        fetchPictures.show(messageTheEnd);
        fetchPictures.hide(gifEl);
        window.removeEventListener('scroll', throttledHandleScroll);

        return;
      }
      boxImg.insertAdjacentHTML(
        'beforeend',
        fetchPictures.createMarkup(imagesArr)
      );

      gallery.refresh();
      isLoading = false;
      fetchPictures.hide(gifEl);
    })
    .catch(e => {
      if (e.code === 'ERR_BAD_REQUEST') {
        fetchPictures.show(messageTheEnd);
        window.removeEventListener('scroll', throttledHandleScroll);
      }
      isLoading = false;
      fetchPictures.hide(gifEl);
    });
}

function onSearchContent(e) {
  e.preventDefault();
  fetchPictures.page = 1;
  fetchPictures.hide(messageTheEnd);
  fetchPictures.value = searchForm.elements.searchQuery.value.trim();
  if (fetchPictures.value === '') {
    fetchPictures.hide(gifEl);
    return;
  }
  fetchPictures.show(gifEl);

  fetchPictures
    .fetchPictures()
    .then(data => {
      const imagesArr = data.hits;
      if (
        data.totalHits === fetchPictures.amountImg(boxImg) ||
        imagesArr.length === 0
      ) {
        fetchPictures.hide(messageTheEnd);
        fetchPictures.hide(gifEl);
        boxImg.innerHTML = '';
        Notify.failure(fetchPictures.message.try_again);
        return;
      }
      Notify.success(`Hooray! We found ${data.totalHits} images.`);

      boxImg.innerHTML = fetchPictures.createMarkup(imagesArr);
      fetchPictures.hide(gifEl);
      isLoading = false;
      gallery.refresh();
      window.addEventListener('scroll', throttledHandleScroll);
    })
    .catch(e => {
      if (e.code === 'ERR_BAD_REQUEST') {
        window.location.reload();
      }
    });
}
