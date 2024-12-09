const formValidation = function() {
  const formElement = document.querySelector('.img-upload__form');

  const pristine = new Pristine(formElement, {
    classTo: 'form-group',
    errorClass: 'has-danger',
    successClass: 'has-success',
    errorTextParent: 'form-group',
    errorTextTag: 'div',
    errorTextClass: 'text-help'
  });

  const validateHashtags = function (textHashtags) {
    const hashtags = textHashtags.split(' ').map(tag => tag.trim());
    const uniqueHashtags = new Set(hashtags);

    if (hashtags.some(tag => !/^#[A-Za-z0-9]+$/.test(tag))) {
      return false;
    }
    if (hashtags.length > 5) {
      return false;
    }
    if (hashtags.length !== uniqueHashtags.size) {
      return false;
    }
    return true;
  };

  pristine.addValidator(
    document.querySelector('.text__hashtags'),
    validateHashtags,
    'Некорректные хэш-теги'
  );

  const validateComment = function (textDescription) {
    return textDescription.length <= 140;
  };

  pristine.addValidator(
    document.querySelector('.text__description'),
    validateComment,
    'Комментарий не должен превышать 140 символов'
  );

  const uploadFileInput = document.querySelector('.img-upload__input');
  const imgUploadOverlay = document.querySelector('.img-upload__overlay');
  const body = document.body;

  uploadFileInput.addEventListener('change', () => {
    imgUploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
  });

  const closeForm = () => {
    imgUploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    uploadFileInput.value = '';

    document.querySelector('.text__hashtags').value = '';
    document.querySelector('.text__description').value = '';
    pristine.reset();
  };

  const cancelButton = document.querySelector('#upload-cancel');

  cancelButton.addEventListener('click', closeForm);
  document.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 27 && document.activeElement !== uploadFileInput) {
      closeForm();
    }
  });

  formElement.addEventListener('submit', function(evt) {
    evt.preventDefault();
    const valid = pristine.validate();
    if (valid) {
      console.log("Форма валидна. Можем отправлять.");
    } else {
      console.log("Форма содержит ошибки.");
    }
  });
};

export{formValidation};
