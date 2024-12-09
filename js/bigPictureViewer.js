const bigPicture = document.querySelector('.big-picture');
const body = document.body;

const renderBigPicture = function (picture) {
  const img = bigPicture.querySelector('.big-picture__img img');
  const caption = bigPicture.querySelector('.social__caption');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count');
  const commentsList = bigPicture.querySelector('.social__comments');
  const commentCountContainer = bigPicture.querySelector('.social__comment-count');
  const commentsLoader = bigPicture.querySelector('.comments-loader');

  commentCountContainer.classList.add('hidden');
  commentsLoader.classList.add('hidden');
  img.src = picture.url;
  img.alt = picture.description;
  caption.textContent = picture.description;
  likesCount.textContent = `${picture.likes}`;
  commentsCount.textContent = `${picture.comments.length}`;

  commentsList.innerHTML = '';

  picture.comments.forEach((comment) => {
    const commentElement = document.createElement('li');
    commentElement.className = 'social__comment';
    commentElement.innerHTML = `<img class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35" height="35">
      <p class="social__text">${comment.message}</p>`;
    commentsList.appendChild(commentElement);
  });

  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  const onEscKeyPress = (evt) => {
    if (evt.keyCode === 27) {
      closeModal();
    }
  };

  const closeModal = () => {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEscKeyPress);
  };

  document.addEventListener('keydown', onEscKeyPress);
  bigPicture.querySelector('.big-picture__cancel').addEventListener('click', closeModal);
};

export {renderBigPicture};
