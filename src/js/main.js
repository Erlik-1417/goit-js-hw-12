import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './pixabay-api.js';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loaderContainers = document.querySelectorAll('.loader-container');

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;
const PER_PAGE = 40;

searchForm.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const searchQuery = form.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    iziToast.warning({
      message: 'Please enter a search keyword!',
      position: 'topRight',
    });
    return;
  }

  currentQuery = searchQuery;
  currentPage = 1;
  gallery.innerHTML = '';
  hideLoadMore();
  showLoader(loaderContainers[0]);

  try {
    const data = await fetchImages(currentQuery, currentPage, PER_PAGE);

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoader(loaderContainers[0]);
      return;
    }

    totalHits = data.totalHits;
    const markup = createGalleryMarkup(data.hits);
    gallery.innerHTML = markup;
    lightbox.refresh();

    if (currentPage * PER_PAGE < totalHits) {
      showLoadMore();
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader(loaderContainers[0]);
    form.reset();
  }
}

async function handleLoadMore() {
  currentPage += 1;
  showLoader(loaderContainers[1]);

  try {
    const data = await fetchImages(currentQuery, currentPage, PER_PAGE);
    const markup = createGalleryMarkup(data.hits);
    gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    if (currentPage * PER_PAGE >= totalHits) {
      hideLoadMore();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    scrollGallery();
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader(loaderContainers[1]);
  }
}

function createGalleryMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
      </a>
      <div class="info-box">
        <p class="info-item"><b>Likes</b><br>${likes}</p>
        <p class="info-item"><b>Views</b><br>${views}</p>
        <p class="info-item"><b>Comments</b><br>${comments}</p>
        <p class="info-item"><b>Downloads</b><br>${downloads}</p>
      </div>
    </li>
  `
    )
    .join('');
}

function showLoader(container) {
  container.classList.remove('is-hidden');
}

function hideLoader(container) {
  container.classList.add('is-hidden');
}

function showLoadMore() {
  loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMore() {
  loadMoreBtn.classList.add('is-hidden');
}

function scrollGallery() {
  const galleryItem = gallery.querySelector('.gallery-item');
  if (galleryItem) {
    const itemHeight = galleryItem.getBoundingClientRect().height;
    window.scrollBy({
      top: itemHeight * 2,
      behavior: 'smooth',
    });
  }
}
