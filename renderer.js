document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('screenshot-form')
  const urlInput = document.getElementById('url-input')
  const formatSelect = document.getElementById('format-select')
  const messageDiv = document.getElementById('message')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const url = urlInput.value.trim()
    const format = formatSelect.value

    //validate is URL is valid
    if (!isValidUrl(url)) {
      showMessage('Please enter a valid URL.', 'error', messageDiv)
      clearForm(urlInput, formatSelect, messageDiv)

      return
    }

    try {
      const result = await window.electron.captureScreenshot(url, format)
      //console.log('resultado', result)
      if (result.filePath != null) {
        showMessage(
          `Screenshot saved in ${result.filePath}`,
          'success',
          messageDiv
        )
      } else {
        showMessage(`Error capturing screen.`, 'error', messageDiv)
      }
    } catch (error) {
      showMessage('Error capturing screen.', 'error')
    } finally {
      // Clean form
      clearForm(urlInput, formatSelect, messageDiv)
    }
  })
})

function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

function showMessage(message, type, messageDiv) {
  messageDiv.textContent = message
  messageDiv.className = ''
  messageDiv.classList.add(type)
}

function clearForm(urlInput, formatSelect, messageDiv) {
  setTimeout(() => {
    urlInput.value = ''
    formatSelect.value = 'png'
    messageDiv.textContent = ''
    messageDiv.className = ''
  }, 5000)
}
