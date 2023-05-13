import { FetchPictures } from './fetchPictures';

// LiBRARIES=====================================================
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import OnlyScroll from 'only-scrollbar';

const fetchPictures = new FetchPictures();

const searchForm = document.getElementById('search-form');
const boxImg = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const wrapperBtn = document.querySelector('.wrapper-btn');

searchForm.addEventListener('submit', onSearchContent);

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    fetchPictures.incrementPage();
    fetchPictures
      .fetchPictures()
      .then(respose => {
        const imagesArr = respose.hits;
        if (!imagesArr.length) {
          wrapperBtn.insertAdjacentHTML(
            'beforeend',
            fetchPictures.message.the_end
          );
          window.removeEventListener('scroll', handleScroll);
          return;
        }
        console.log(respose);
        boxImg.insertAdjacentHTML(
          'beforeend',
          fetchPictures.createMarkup(imagesArr)
        );

        new SimpleLightbox('.photo-link').refresh();
      })
      .catch(e => {
        if (e.status === 400 || 'ERR_BAD_REQUEST') {
          wrapperBtn.insertAdjacentHTML(
            'beforeend',
            fetchPictures.message.the_end
          );
          window.removeEventListener('scroll', handleScroll);
        }
      });
  }
}

function onSearchContent(e) {
  e.preventDefault();
  fetchPictures.value = searchForm.elements.searchQuery.value.trim();
  if (fetchPictures.value === '') {
    return;
  }
  fetchPictures
    .fetchPictures()
    .then(respose => {
      const messageTheEnd = document.querySelector('.gallery-text');
      const imagesArr = respose.hits;
      if (imagesArr.length < 1) {
        boxImg.innerHTML = '';
        fetchPictures.hide(btnLoadMore);
        messageTheEnd && fetchPictures.hide(messageTheEnd);
        Notify.failure(fetchPictures.message.try_again);
        return;
      }
      Notify.success(`Hooray! We found ${respose.totalHits} images.`);

      boxImg.innerHTML = fetchPictures.createMarkup(imagesArr);

      fetchPictures.show(btnLoadMore);
      messageTheEnd && fetchPictures.hide(messageTheEnd);
      new SimpleLightbox('.photo-link');
      window.addEventListener('scroll', handleScroll);
    })
    .catch(e => {
      if (e.status === 400 || 'ERR_BAD_REQUEST') {
        window.location.reload();
      }
    });
}

// FUNCTION OPEN TO BUTTON=================================================

// btnLoadMore.addEventListener('click', onShowMore);

// function onShowMore() {
//   fetchPictures.incrementPage();
//   fetchPictures
//     .fetchPictures()
//     .then(respose => {
//       const imagesArr = respose.hits;
//       if (!imagesArr.length) {
//         fetchPictures.hide(btnLoadMore);
//         wrapperBtn.insertAdjacentHTML(
//           'beforeend',
//           fetchPictures.message.the_end
//         );
//           return;
//       }
//       boxImg.insertAdjacentHTML(
//         'beforeend',
//         fetchPictures.createMarkup(imagesArr)
//       );

//       new SimpleLightbox('.photo-link').refresh();
//     })
//     .catch(e => {
//     if (e.status === 400 || 'ERR_BAD_REQUEST') {
//         fetchPictures.hide(btnLoadMore);
//         wrapperBtn.insertAdjacentHTML(
//           'beforeend',
//           fetchPictures.message.the_end
//         );
//       }
//     });
// }
