const renderBigPicture = function (picture) {
  const bigPicture = document.querySelector('.big-picture');
  const body = document.body;

  const img = bigPicture.querySelector('.big-picture__img img');
  const caption = bigPicture.querySelector('.social__caption');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentsCount = bigPicture.querySelector('.comments-count');
  const commentsList = bigPicture.querySelector('.social__comments');
  const commentCountContainer = bigPicture.querySelector('.social__comment-count');
  const commentsLoader = bigPicture.querySelector('.comments-loader');

  commentCountContainer.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  img.src = picture.url;
  img.alt = picture.description;
  caption.textContent = picture.description;
  likesCount.textContent = `${picture.likes}`;
  commentsCount.textContent = `${picture.comments.length}`;

  commentsList.innerHTML = '';

  const commentsPerPage = 5;
  let currentCommentIndex = 0;

  const showComments = () => {
    const commentsToShow = picture.comments.slice(currentCommentIndex, currentCommentIndex + commentsPerPage);
    commentsToShow.forEach((comment) => {
      const commentElement = document.createElement('li');
      commentElement.className = 'social__comment';
      commentElement.innerHTML = `<img class="social__picture"
        src="${comment.avatar}"
        alt="${comment.name}"
        width="35" height="35">
        <p class="social__text">${comment.message}</p>`;
      commentsList.appendChild(commentElement);
    });
    currentCommentIndex += commentsToShow.length;
    commentCountContainer.textContent = `${currentCommentIndex} из ${commentsCount.textContent} комментариев`;

    if (currentCommentIndex >= picture.comments.length) {
      commentsLoader.classList.add('hidden');
    }
    if (!document.querySelector('.comments-count')) {
      const newCommentsCount = document.createElement('span');
      newCommentsCount.className = 'comments-count';
      commentCountContainer.appendChild(newCommentsCount);
    }
  };

  showComments();

  commentsLoader.addEventListener('click', showComments);


  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  const onEscKeyPress = (evt) => {
    if (evt.keyCode === 27) {
      bigPicture.classList.add('hidden');
      body.classList.remove('modal-open');
      document.removeEventListener('keydown', onEscKeyPress);
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
