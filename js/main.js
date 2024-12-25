import './util.js';
import { renderPictures } from './pictureRenderer.js';
import { renderBigPicture } from './bigPictureViewer.js';
import { getPosts } from './api.js';
import { validateForm } from './formValidation.js';

const postsContainer = document.querySelector('.pictures');
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

validateForm();
