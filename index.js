const BASE_URL = 'https://api-ssl.bitly.com'
const PATH_URL = '/v4/shorten'
const accessToken = '88539196fc2f089677d858f7b2ca521e8f0eeba6'
const mainShortenButton = document.querySelector('#main-shorten-button')
const mainCopyInput = document.querySelector('#main-copy-input')
const mainCopyButton = document.querySelector('#main-copy-button')
new ClipboardJS('#main-copy-input')


////////// Function Group Starts Here //////////
// Render countdown timer on main-shorten-button
function renderCountdown(time) {
  let countDown = Math.ceil(time / 1000)
  const timer = setInterval(() => {
    if (countDown >= 0) {
      mainShortenButton.innerHTML = `New link can be shorten in ${countDown}`
      countDown--
    } else {
      clearInterval(timer)
      mainShortenButton.innerHTML = 'Shorten'
    }
  }, 750);
}

// Render both dropdown and pullback actions from main-copy-section
function renderCopySection(response) {
  const mainCopySection = document.querySelectorAll('.main-copy-section')[0]

  const {link} = response.data
  mainCopyInput.value = link
  mainShortenButton.disabled = true
  mainCopySection.style.opacity = '1'
  mainCopySection.style.transform = 'rotate(0deg) scale(1)'

  renderCountdown(5000)
  setTimeout(() => {
    mainCopySection.style.opacity = '0'
    mainCopySection.style.transform = 'rotate(-90deg) scale(0)'
    mainShortenButton.disabled = false
  }, 5000)
}
////////// Function Group Starts Here //////////


////////// Event Listener Group Starts Here //////////
// main-shorten-button to trigger Axios POST request
mainShortenButton.addEventListener(
  'click', 
  function onMainShortenButtonClicked(event) {
    event.preventDefault()

    const mainShortenInput = document.querySelector('#main-shorten-input')
    const inputURL = mainShortenInput.value.trim().toLowerCase()

    // if invalid input is found, then trigger alert
    if (inputURL.length === 0) {
      mainShortenInput.classList.add('is-invalid')
      return
    }

    const axiosConfig = {
      method: 'post',
      url: BASE_URL + PATH_URL,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ 'long_url': inputURL })
    }

    axios(axiosConfig)
      .then(rep => renderCopySection(rep))
      .catch(err => err)
})

// main-copy-button to copy short URL into user's clipboard
mainCopyButton.addEventListener(
  'click', 
  function onMainCopyButtonClicked(event) {
    event.preventDefault()
    navigator.clipboard.writeText(mainCopyInput.value)
})
////////// Event Listener Group Ends Here //////////