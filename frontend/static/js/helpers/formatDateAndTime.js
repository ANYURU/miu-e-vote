function formatDateAndTime(dateString) {
  const parsedDate = new Date(dateString);

  if (isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  const day = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();
  const hours = parsedDate.getHours();
  const minutes = parsedDate.getMinutes();

  const formattedDate = `${day}/${month}/${year} at ${hours}:${minutes}`;
  return formattedDate;
}

export { formatDateAndTime };
