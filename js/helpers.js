//перевод времени строки в минуты с начала суток
function timeStringToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
export{timeStringToMinutes};
