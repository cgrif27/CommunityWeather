export default function celciusToFahrenheit(temp, units) {
  if (units === "celcius") {
    return temp.toFixed(0);
  } else if (units === "fahrenheit") {
    let fahrenheit = temp * (9 / 5) + 32;
    return fahrenheit.toFixed(0);
  }
}
