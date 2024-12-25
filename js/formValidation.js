const validateForm = function() {
  const formElement = document.querySelector('.img-upload__form');
  const pristine = new Pristine(formElement, {
    classTo: 'form-group',
    errorClass: 'has-danger',
    successClass: 'has-success',
    errorTextParent: 'form-group',
    errorTextTag: 'div',
    errorTextClass: 'text-help'
  });

  const createErrorMessage = (message) => {
    if (message !== null) {
      const errorMessage = document.querySelector('.text__hashtags__error-text');
      errorMessage.textContent = message;
    }};

  const deleteErrorMessage = () => {
    document.querySelector('.text__hashtags__error-text').textContent = '';
  };

  const validateHashtags = function(textHashtags) {
    if(textHashtags.trim() === ''){
      deleteErrorMessage();
      return true;
    }
    const hashtags = textHashtags.split(/\s+/).map(tag => tag.trim()).filter(tag => tag !== '');
    const lowerCaseHashtags = hashtags.map(tag => tag.toLowerCase());
    const uniqueHashtags = new Set(lowerCaseHashtags);
    if (hashtags.length > 5){
      createErrorMessage('Можно использовать не более 5 хэш-тегов');
      return false;
    };
    if (!hashtags.every(tag => /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/.test(tag))){
      createErrorMessage('Хэш-тег может состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи, а длина должна быть от 2 до 20 символов, включая решетку');
      return false;
    };
    if (hashtags.length !== uniqueHashtags.size){
      createErrorMessage('Нельзя использовать повторяющиеся хэш-теги');
      return false;
    };
    deleteErrorMessage();
    return true;
  };

  pristine.addValidator(
    document.querySelector('.text__hashtags'),
    validateHashtags,
    'Некорректные хэш-теги'
  );

  const validateComment = function(textDescription) {
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
  const imagePreview = document.querySelector('.img-upload__preview img');
  const imageScaleInput = document.querySelector('.scale__control--value');

  const scaleHiddenInput = formElement.querySelector('input[name="scale"]');

  const effectLevelSlider = document.querySelector('.effect-level__slider');

  noUiSlider.create(effectLevelSlider, {
    start: [100],
    connect: [true, false],
    range: {
      min: [0],
      max: [100],
    },
    step: 1,
    tooltips: true,
  });

  const resetEffectLevel = () => {
    effectLevelSlider.noUiSlider.set([100]);
    document.querySelector('.effect-level__value').value = 100;
    imagePreview.style.filter = '';
  };

  const updateImageEffect = (effect, value) => {
    switch (effect) {
      case 'chrome':
        imagePreview.style.filter = `grayscale(${value / 100})`;
        break;
      case 'sepia':
        imagePreview.style.filter = `sepia(${value / 100})`;
        break;
      case 'marvin':
        imagePreview.style.filter = `invert(${value}%)`;
        break;
      case 'phobos':
        imagePreview.style.filter = `blur(${(value / 100) * 3}px)`;
        break;
      case 'heat':
        imagePreview.style.filter = `brightness(${1 + (value / 100 * 2)})`;
        break;
      default:
        imagePreview.style.filter = '';
    }
  };

  const effectRadios = document.querySelectorAll('.effects__radio');
  effectRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const effect = radio.value;
      resetEffectLevel();
      if (effect === 'none') {
        imagePreview.style.filter = '';
        effectLevelSlider.classList.add('hidden');
      } else {
        effectLevelSlider.classList.remove('hidden');
        updateImageEffect(effect, 100);
        document.querySelector('.effect-level__value').value = 100;
      }
    });
  });

  effectLevelSlider.noUiSlider.on('update', (values) => {
    const value = values[0];
    document.querySelector('.effect-level__value').value = value;
    const selectedEffect = document.querySelector('.effects__radio:checked').value;
    updateImageEffect(selectedEffect, value);
  });

  const SCALE_VALUE_STEP = 25;
  let currentScale = 100;

  const updateScaleValue = () => {
    imageScaleInput.value = currentScale + '%';
    scaleHiddenInput.value = currentScale + '%';
    imagePreview.style.transform = `scale(${currentScale / 100})`;
  };

  document.querySelector('.scale__control--smaller').addEventListener('click', () => {
    if (currentScale > SCALE_VALUE_STEP) {
      currentScale -= SCALE_VALUE_STEP;
      updateScaleValue();
    }
  });

  document.querySelector('.scale__control--bigger').addEventListener('click', () => {
    if (currentScale < 100) {
      currentScale += SCALE_VALUE_STEP;
      updateScaleValue();
    }
  });

  uploadFileInput.addEventListener('change', () => {
    imgUploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    const file = uploadFileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  const closeForm = () => {
    imgUploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    uploadFileInput.value = '';
    document.querySelector('.text__hashtags').value = '';
    document.querySelector('.text__description').value = '';
    pristine.reset();
    resetEffectLevel();
    currentScale = 100;
    updateScaleValue();
  };

  const cancelButton = document.querySelector('#upload-cancel');
  cancelButton.addEventListener('click', closeForm);
  document.addEventListener('keydown', function(evt) {
    if (evt.key === 'Escape' && document.activeElement !== uploadFileInput &&
      document.activeElement !== document.querySelector('.text__hashtags') &&
      document.activeElement !== document.querySelector('.text__description')) {
      closeForm();
    }
  });

  formElement.addEventListener('submit', function(evt) {
    evt.preventDefault();
    const valid = pristine.validate();
    if (valid) {
      const submitButton = formElement.querySelector('.img-upload__submit');
      submitButton.disabled = true;

      const formData = new FormData(formElement);
      fetch('https://29.javascript.htmlacademy.pro/kekstagram/', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (response.ok) {
          closeForm();
          showMessage('#success', 'success', '.success');
        } else {
          throw new Error('Ошибка отправки данных');
        }
      })
      .catch(() => {
        showMessage('#error', 'error', '.error');
      })
      .finally(() => {
        submitButton.disabled = false;
      });
    } else {
      alert('Ошибка заполнения формы')
    }
  });

  const showMessage = (templateId, type, contentType) => {
    const messageTemplate = document.querySelector(templateId).content.querySelector(contentType);
    const messageElement = messageTemplate.cloneNode(true);

    document.body.appendChild(messageElement);

    const closeMessage = () => {
      messageElement.remove();
      document.removeEventListener('keydown', onEscPress);
      messageElement.removeEventListener('click', closeMessage);
    };

    const onEscPress = (evt) => {
      if (evt.key === 'Escape') {
        closeMessage();
      }
    };

    messageElement.querySelector(`.${type}__button`).addEventListener('click', closeMessage);
    document.addEventListener('keydown', onEscPress);
    messageElement.addEventListener('click', (evt) => {
      if (evt.target === messageElement) {
        closeMessage();
      }
    });
  };
  return pristine;
};

export {validateForm};
