export default function getColor() {
  let hourTime = new Date().getHours();
  if (hourTime >= 5 && hourTime < 18) {
    return "#D7902F";
  }
  return "#242B73";
}
