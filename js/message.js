const ALERT_SHOW_TIME = 5000;

function showAlert(message) {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'fixed';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '16px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';
  alertContainer.style.color = 'white';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
}

function showSuccessMessage() {
  const template = document.querySelector('#success');
  if (!template) {
    return;
  }

  const messageFragment = template.content.cloneNode(true);
  const messageElement = messageFragment.querySelector('.success');
  const button = messageElement.querySelector('.success__button');

  document.body.appendChild(messageElement);

  function closeMessage() {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onOutsideClick);
  }

  if (button) {
    button.addEventListener('click', closeMessage);
  }

  function onDocumentKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMessage();
    }
  }

  function onOutsideClick(evt) {
    // Клик по любой области вне сообщения закрывает его
    if (!messageElement.contains(evt.target)) {
      closeMessage();
    }
  }

  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onOutsideClick);
}

function showErrorMessage() {
  const template = document.querySelector('#error');
  if (!template) {
    return;
  }

  const messageFragment = template.content.cloneNode(true);
  const messageElement = messageFragment.querySelector('.error');
  const button = messageElement.querySelector('.error__button');

  document.body.appendChild(messageElement);

  function closeMessage() {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onOutsideClick);
  }

  if (button) {
    button.addEventListener('click', closeMessage);
  }

  function onDocumentKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMessage();
    }
  }

  function onOutsideClick(evt) {
    // Клик по любой области вне сообщения закрывает его
    if (!messageElement.contains(evt.target)) {
      closeMessage();
    }
  }

  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onOutsideClick);
}

export { showAlert, showSuccessMessage, showErrorMessage };
