export function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const fractional_day = serial - Math.floor(serial);
  const total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;
  const minutes = Math.floor((total_seconds % 3600) / 60);
  const hours = Math.floor(total_seconds / 3600);
  const date = new Date(utc_value * 1000);
  date.setUTCHours(hours, minutes, seconds);
  return date;
}
