import { getPosts } from './api.js';
import { renderPictures } from './pictureRenderer.js';
import { getRandomInteger, debounce } from './util.js';
import { renderBigPicture } from './bigPictureViewer.js';

const defaultFilter = document.querySelector('#filter-default');
const randomFilter = document.querySelector('#filter-random');
const discussedFilter = document.querySelector('#filter-discussed');
let posts = [];

const fetchPosts = async () => {
  try {
    posts = await getPosts();
    renderPictures(posts);
  } catch (error) {
    console.error('Ошибка при загрузке постов:', error);
    alert('Не удалось загрузить фотографии. Попробуйте позже.');
  }
};

fetchPosts();
const cont = document.querySelector('.img-filters');
cont.classList.remove('img-filters--inactive');
const postsContainer = document.querySelector('.pictures');

const handlePictureClick = (evt) => {
  const pictureElement = evt.target.closest('.picture');
  if (pictureElement) {
    const postId = pictureElement.getAttribute('data-id');
    const post = posts.find((p) => p.id === Number(postId));
    if (post) {
      renderBigPicture(post);
    }
  }
};

postsContainer.addEventListener('click', handlePictureClick);

const renderDefault = debounce((photoData) => {
  renderPictures(photoData);
}, 500);

const applyDefaultFilter = (photoData) => {
  randomFilter.classList.remove('img-filters__button--active');
  discussedFilter.classList.remove('img-filters__button--active');
  defaultFilter.classList.add('img-filters__button--active');
  renderDefault(photoData);
};

const renderRandow = debounce((photoData) => {
  renderPictures(photoData);
}, 500);

const applyRandomFilter = (photoData) => {
  defaultFilter.classList.remove('img-filters__button--active');
  discussedFilter.classList.remove('img-filters__button--active');
  randomFilter.classList.add('img-filters__button--active');
  const randomPhotos = [];
  const selectedIndices = new Set();

  while (randomPhotos.length < 10 && selectedIndices.size < photoData.length) {
    const index = getRandomInteger(0, photoData.length - 1);
    if (!selectedIndices.has(index)) {
      selectedIndices.add(index);
      randomPhotos.push(photoData[index]);
    }
  }

  renderRandow(randomPhotos);
};

const renderDisscussed = debounce((photoData) => {
  renderPictures(photoData);
}, 500);

const applyDiscussedFilter = (photoData) => {
  defaultFilter.classList.remove('img-filters__button--active');
  randomFilter.classList.remove('img-filters__button--active');
  discussedFilter.classList.add('img-filters__button--active');
  const discussedPhotos = photoData.slice();

  discussedPhotos.sort((firstPhoto, secondPhoto) => {
    return secondPhoto.comments.length - firstPhoto.comments.length;
  });

  renderDisscussed(discussedPhotos);
};

defaultFilter.addEventListener('click', () => applyDefaultFilter(posts));
randomFilter.addEventListener('click', () => applyRandomFilter(posts));
discussedFilter.addEventListener('click', () => applyDiscussedFilter(posts));
