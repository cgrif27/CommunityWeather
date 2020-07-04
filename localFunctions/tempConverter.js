export default function tempConverter(temp, units) {
  if (units === "celcius") {
    let convert = temp - 273.15;
    return convert.toFixed(1);
  } else if (units === "fahrenheit") {
    let convert = temp - 273.15;
    let fahrenheit = convert * (9 / 5) + 32;
    return fahrenheit.toFixed(1);
  }
}
