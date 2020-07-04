function dateSuffix(d) {
  if (d > 3 && d < 21) return d + "th";
  switch (d % 10) {
    case 1:
      return d + "st";
    case 2:
      return d + "nd";
    case 3:
      return d + "rd";
    default:
      return d + "th";
  }
}

export default function getDate(time) {
  const months = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let date = new Date(time);
  let month = months[date.getMonth()];
  let day = date.getDate();

  return `${dateSuffix(
    date.getDate()
  )} ${month}, ${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
}
