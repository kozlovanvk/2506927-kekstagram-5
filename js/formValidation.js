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

    if (hashtags.some(tag => !/^#[A-Za-z0-9]+$/.test(tag))) return false;
    if (hashtags.length > 5) return false;
    if (hashtags.length !== uniqueHashtags.size) return false;
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
      }
  };

  effectLevelSlider.noUiSlider.on('update', (values) => {
    const value = values[0];
    document.querySelector('.effect-level__value').value = value; // Записывание значения в скрытое поле
    const selectedEffect = document.querySelector('.effects__radio:checked').value;
    updateImageEffect(selectedEffect, value);
  });

  const scaleValueStep = 25;
  let currentScale = 100;

  const updateScaleValue = () => {
    imageScaleInput.value = `${currentScale}%`;
    scaleHiddenInput.value = currentScale; // Записываем значение в скрытое поле для отправки на сервер
    imagePreview.style.transform = `scale(${currentScale / 100})`;
  };

  document.querySelector('.scale__control--smaller').addEventListener('click', () => {
    if (currentScale > scaleValueStep) {
      currentScale -= scaleValueStep;
      updateScaleValue();
    }
  });

  document.querySelector('.scale__control--bigger').addEventListener('click', () => {
    if (currentScale < 100) {
      currentScale += scaleValueStep;
      updateScaleValue();
    }
  });

  uploadFileInput.addEventListener('change', () => {
    imgUploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    const file = uploadFileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
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
  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape' && document.activeElement !== uploadFileInput &&
      document.activeElement !== document.querySelector('.text__hashtags') &&
      document.activeElement !== document.querySelector('.text__description')) {
      closeForm();
    }
  });

  formElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    const valid = pristine.validate();
    if (valid) {
      console.log("Форма валидна. Отправляем на сервер...");
      const submitButton = formElement.querySelector('.img-upload__submit');
      submitButton.disabled = true;

      const formData = new FormData(formElement);
      fetch('https://29.javascript.htmlacademy.pro/kekstagram/data', {
        method: 'POST',
        body: formData,
      }).then(response => {
        if (response.ok) {
          console.log('Данные успешно отправлены.');
          closeForm();
          showMessage('#success');
        } else {
          throw new Error('Ошибка отправки данных');
        }}).catch(() => {
          console.log('Ошибка отправки данных.');
          showMessage('#error');
        }).finally(() => {
          submitButton.disabled = false;
        });
    } else {
      console.log("Форма содержит ошибки.");
    }
  });

  const showMessage = (templateId) => {
    const messageTemplate = document.querySelector(templateId).content.querySelector('div');
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

    messageElement.querySelector(`.${templateId.slice(1)}__button`).addEventListener('click', closeMessage);
    document.addEventListener('keydown', onEscPress);
    messageElement.addEventListener('click', (evt) => {
      if (evt.target === messageElement) {
        closeMessage();
      }
    });
  };
};

export{formValidation};
