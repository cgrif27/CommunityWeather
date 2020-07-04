export default function getTempRange(temp) {
  if (temp < 0) return "-0";
  if (temp > 0 && temp <= 18) return "0-18";
  if (temp > 18 && temp <= 24) return "18-24";
  if (temp > 24 && temp <= 27) return "24-27";
  if (temp > 27 && temp <= 35) return "27-35";
  if (temp > 35) return "35+";
}
