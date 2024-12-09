const renderPictures = function(picturesData){
  const picturesContainer = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();
  const template = document.getElementById('picture').content;

  picturesData.forEach((picture) => {
    const pictureElement = template.cloneNode(true);
    const img = pictureElement.querySelector('.picture__img');
    const likes = pictureElement.querySelector('.picture__likes');
    const comments = pictureElement.querySelector('.picture__comments');

    pictureElement.querySelector('.picture').setAttribute('data-id', picture.id);

    img.src = picture.url;
    img.alt = picture.description;
    likes.textContent = picture.likes;
    comments.textContent = picture.comments;
    fragment.appendChild(pictureElement);
  });
  picturesContainer.appendChild(fragment);
};
export {renderPictures};
