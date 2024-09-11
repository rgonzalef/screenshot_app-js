// Function to format the date in YYYY-MM-DD_HH-MM-SS format
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Mes comienza desde 0
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // YYYY-MM-DD_HH-MM-SS
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

module.exports = { formatDate }
