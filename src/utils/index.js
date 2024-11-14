
// Function to parse dateTimes from "01 Aug 2024 20:12:10 GMT" to "dd/mm/yyyy hh:mm"
const formatDateTime = (datetime) => {
  const date = new Date(datetime);

  const formattedDate = date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 24-hour format
  }).replace(',', '');

  return formattedDate;
}

const capitalizeFirstLetter = (string) => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
}

export {
  formatDateTime,
  capitalizeFirstLetter,
}