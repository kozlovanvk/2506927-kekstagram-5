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
    }
  };

  const deleteErrorMessage = () => {
    document.querySelector('.text__hashtags__error-text').textContent = '';
  };

  const validateHashtags = function(textHashtags) {
    if(textHashtags.trim() === ''){
      deleteErrorMessage();
      return true;
    }
    const hashtags = textHashtags.split(/\s+/).map((tag) => tag.trim()).filter((tag) => tag !== '');
    const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
    const uniqueHashtags = new Set(lowerCaseHashtags);
    if (hashtags.length > 5){
      createErrorMessage('Можно использовать не более 5 хэш-тегов');
      return false;
    }
    if (!hashtags.every((tag) => /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/.test(tag) && tag.length > 1)){
      createErrorMessage('Хэш-тег может состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи, а длина должна быть от 2 до 20 символов, включая решетку');
      return false;
    }
    if (hashtags.length !== uniqueHashtags.size){
      createErrorMessage('Нельзя использовать повторяющиеся хэш-теги');
      return false;
    }
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
  const effectValue = document.querySelector('.effect-level__value');

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
    effectValue.value = 100;
    imagePreview.style.filter = '';
  };

  function filterNone() {
    effectLevelSlider.classList.add('hidden');
    imagePreview.style.filter = '';
    imagePreview.classList.remove(imagePreview.classList[0]);
    imagePreview.classList.add('effects__preview--none');
  }

  function filterChrome() {
    effectLevelSlider.classList.remove('hidden');
    effectLevelSlider.noUiSlider.updateOptions ({
      range: {
        min: 0,
        max: 1,
      },
      step: 0.1,
      start: 1,
    });
    imagePreview.classList.remove(imagePreview.classList[0]);
    imagePreview.classList.add('effects__preview--chrome');
    effectLevelSlider.noUiSlider.on('update', () => {
      imagePreview.style.filter = `grayscale(${effectLevelSlider.noUiSlider.get()})`;
      effectValue.value = effectLevelSlider.noUiSlider.get();
    });
  }

  function filterSepia() {
    effectLevelSlider.classList.remove('hidden');
    effectLevelSlider.noUiSlider.updateOptions ({
      range: {
        min: 0,
        max: 1,
      },
      step: 0.1,
      start: 1,
    });
    imagePreview.classList.remove(imagePreview.classList[0]);
    imagePreview.classList.add('effects__preview--sepia');
    effectLevelSlider.noUiSlider.on('update', () => {
      imagePreview.style.filter = `sepia(${effectLevelSlider.noUiSlider.get()})`;
      effectValue.value = effectLevelSlider.noUiSlider.get();
    });
  }

  function filterMarvin() {
    effectLevelSlider.classList.remove('hidden');
    effectLevelSlider.noUiSlider.updateOptions ({
      range: {
        min: 0,
        max: 100,
      },
      step: 1,
      start: 100,
    });
    imagePreview.classList.remove(imagePreview.classList[0]);
    imagePreview.classList.add('effects__preview--marvin');
    effectLevelSlider.noUiSlider.on('update', () => {
      imagePreview.style.filter = `invert(${effectLevelSlider.noUiSlider.get()}%)`;
      effectValue.value = effectLevelSlider.noUiSlider.get();
    });
  }

  function filterPhobos() {
    effectLevelSlider.classList.remove('hidden');
    effectLevelSlider.noUiSlider.updateOptions ({
      range: {
        min: 0,
        max: 3,
      },
      step: 0.1,
      start: 3,
    });
    imagePreview.classList.remove(imagePreview.classList[0]);
    imagePreview.classList.add('effects__preview--phobos');
    effectLevelSlider.noUiSlider.on('update', () => {
      imagePreview.style.filter = `blur(${effectLevelSlider.noUiSlider.get()}px)`;
      effectValue.value = effectLevelSlider.noUiSlider.get();
    });
  }

  function filterHeat() {
    effectLevelSlider.classList.remove('hidden');
    effectLevelSlider.noUiSlider.updateOptions ({
      range: {
        min: 1,
        max: 3,
      },
      step: 0.1,
      start: 3,
    });
    imagePreview.classList.remove(imagePreview.classList[0]);
    imagePreview.classList.add('effects__preview--heat');
    effectLevelSlider.noUiSlider.on('update', () => {
      imagePreview.style.filter = `brightness(${effectLevelSlider.noUiSlider.get()})`;
      effectValue.value = effectLevelSlider.noUiSlider.get();
    });
  }

  const effectRadios = document.querySelectorAll('.effects__radio');
  effectRadios.forEach((radio) => {
    radio.addEventListener('change', (evt) => {
      if (evt.target.value === 'none') {
        filterNone();
      } else if (evt.target.value === 'chrome') {
        filterChrome();
      } else if (evt.target.value === 'sepia') {
        filterSepia();
      } else if (evt.target.value === 'marvin') {
        filterMarvin();
      } else if (evt.target.value === 'phobos') {
        filterPhobos();
      } else if (evt.target.value === 'heat') {
        filterHeat();
      }
    });
  });

  effectLevelSlider.noUiSlider.on('update', (values) => {
    const value = values[0];
    effectValue.value = value;
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
        resetEffectLevel();

        const previews = document.querySelectorAll('.effects__preview');
        previews.forEach((preview) => {
          preview.style.backgroundImage = `url('${e.target.result}')`;
        });

        if (document.querySelector('.effects__radio:checked').value === 'none') {
          effectLevelSlider.classList.add('hidden');
        } else {
          effectLevelSlider.classList.remove('hidden');
        }
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
    effectRadios.forEach(radio => {
        radio.checked = radio.value === 'none';
    });
    imagePreview.className = '';
    imagePreview.style.filter = '';
    imagePreview.classList.add('effects__preview--none');
    deleteErrorMessage();
  };

  let isMessageOpen = false;

  const cancelButton = document.querySelector('#upload-cancel');
  cancelButton.addEventListener('click', closeForm);
  document.addEventListener('keydown', function(evt) {
    if (evt.key === 'Escape' && document.activeElement !== uploadFileInput &&
      document.activeElement !== document.querySelector('.text__hashtags') &&
      document.activeElement !== document.querySelector('.text__description') && !isMessageOpen) {
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
      showMessage('#error', 'error', '.error');
    }
  });

  const showMessage = (templateId, type, contentType) => {
    isMessageOpen = true;
    const messageTemplate = document.querySelector(templateId).content.querySelector(contentType);
    const messageElement = messageTemplate.cloneNode(true);

    document.body.appendChild(messageElement);

    const closeMessage = () => {
      isMessageOpen = false;
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
