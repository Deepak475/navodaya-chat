import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatWrapper = document.querySelector('#chat_wrapper');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
     element.textContent += '.';

     if(element.textContent === '....') {
      element.textContent = '';
     }
  }, 400)
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval)
    }
  }, 30)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
  return (
    `<div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    <div>
    `
  )
}

const handleSubmit = async (event) => {
  event.preventDefault();
  document.querySelector('.welcome-wrapper').style.display = 'none';
  const data = new FormData(form);

  // User Chat Stripe
  chatWrapper.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  // Bot Chat Stripe
  const uniqueId = generateUniqueId();
  chatWrapper.innerHTML += chatStripe(true, " ", uniqueId);
  chatWrapper.scrollTop = chatWrapper.scrollHeight;
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  // fetch messages from server(bot response)
  const response = await fetch('http://localhost:7000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  if(response.ok) {
    const data = await response.json();
    const parseData = data.bot.trim();

    typeText(messageDiv, parseData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = 'server error: ' + err;
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (event) => {
  if(event.keyCode === 13) {
    handleSubmit(event);
  }
});