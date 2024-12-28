const imgForm = document.querySelector('#upload-select-image');
const submitButton = imgForm.querySelector('#upload-submit');
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

const validateHashtags = (textHashtags) => {
  if(textHashtags.trim() === ''){
    submitButton.disabled = false;
    deleteErrorMessage();
    return true;
  }
  const hashtags = textHashtags.split(/\s+/).map((tag) => tag.trim()).filter((tag) => tag !== '');
  const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
  const uniqueHashtags = new Set(lowerCaseHashtags);
  if (hashtags.length > 5){
    submitButton.disabled = true;
    createErrorMessage('Можно использовать не более 5 хэш-тегов');
    return false;
  }
  if (!hashtags.every((tag) => /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/.test(tag) && tag.length > 1)){
    submitButton.disabled = true;
    createErrorMessage('Хэш-тег может состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи, а длина должна быть от 2 до 20 символов, включая решетку');
    return false;
  }
  if (hashtags.length !== uniqueHashtags.size){
    submitButton.disabled = true;
    createErrorMessage('Нельзя использовать повторяющиеся хэш-теги');
    return false;
  }
  deleteErrorMessage();
  submitButton.disabled = false;
  return true;
};

pristine.addValidator(
  document.querySelector('.text__hashtags'),
  validateHashtags,
  'Некорректные хэш-теги'
);

const validateComment = (textDescription) => textDescription.length <= 140;

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

const filterNone = () => {
  effectLevelSlider.classList.add('hidden');
  imagePreview.style.filter = '';
  imagePreview.classList.remove(imagePreview.classList[0]);
  imagePreview.classList.add('effects__preview--none');
};

const filterChrome = () => {
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
};

const filterSepia = () => {
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
};

const filterMarvin = () => {
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
};

const filterPhobos = () => {
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
};

const filterHeat = () => {
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
};

const effectRadios = document.querySelectorAll('.effects__radio');
effectRadios.forEach((radio) => {
  radio.addEventListener('change', (evt) => {
    switch (evt.target.value) {
      case 'none':
        filterNone();
        break;
      case 'chrome':
        filterChrome();
        break;
      case 'sepia':
        filterSepia();
        break;
      case 'marvin':
        filterMarvin();
        break;
      case 'phobos':
        filterPhobos();
        break;
      case 'heat':
        filterHeat();
        break;
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
  imageScaleInput.value = `${currentScale}%`;
  scaleHiddenInput.value = `${currentScale}%`;
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

let isMessageOpen = false;

const onEscClick = (evt) => {
  if (evt.key === 'Escape' && document.activeElement !== uploadFileInput &&
    document.activeElement !== document.querySelector('.text__hashtags') &&
    document.activeElement !== document.querySelector('.text__description') && !isMessageOpen) {
    // eslint-disable-next-line no-use-before-define
    closeForm();
  }
};

uploadFileInput.addEventListener('change', () => {
  imgUploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onEscClick);
  const file = uploadFileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      imagePreview.src = evt.target.result;
      resetEffectLevel();

      const previews = document.querySelectorAll('.effects__preview');
      previews.forEach((preview) => {
        preview.style.backgroundImage = `url('${evt.target.result}')`;
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
  // eslint-disable-next-line no-use-before-define
  document.removeEventListener('keydown', onEscClick);
  uploadFileInput.value = '';
  document.querySelector('.text__hashtags').value = '';
  document.querySelector('.text__description').value = '';
  pristine.reset();
  resetEffectLevel();
  currentScale = 100;
  updateScaleValue();
  effectRadios.forEach((radio) => {
    radio.checked = radio.value === 'none';
  });
  imagePreview.className = '';
  imagePreview.style.filter = '';
  imagePreview.classList.add('effects__preview--none');
  deleteErrorMessage();
};

const cancelButton = document.querySelector('#upload-cancel');
cancelButton.addEventListener('click', closeForm);

const showMessage = (templateId, type, contentType) => {
  isMessageOpen = true;
  const messageTemplate = document.querySelector(templateId).content.querySelector(contentType);
  const messageElement = messageTemplate.cloneNode(true);

  document.body.appendChild(messageElement);

  const closeMessage = () => {
    isMessageOpen = false;
    messageElement.remove();
    submitButton.disabled = false;
    document.removeEventListener('keydown', onEscClick);
    messageElement.removeEventListener('click', closeMessage);
  };

  messageElement.querySelector(`.${type}__button`).addEventListener('click', closeMessage);
  document.addEventListener('keydown', onEscClick);
  messageElement.addEventListener('click', (evt) => {
    if (evt.target === messageElement) {
      closeMessage();
    }
  });
};

formElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const valid = pristine.validate();
  if (valid) {
    submitButton.disabled = true;

    const formData = new FormData(formElement);
    fetch('https://29.javascript.htmlacademy.pro/kekstagram/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
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
    submitButton.disabled = true;
  }
});

export{showMessage};
