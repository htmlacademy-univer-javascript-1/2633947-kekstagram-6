import {timeStringToMinutes} from './helpers';
// Главная функция — возвращает true, если встреча укладывается в рабочий день
function isMeetingWithinWorkday(startWork, endWork, startMeeting, duration) {
  // Переводим все времена в минуты с начала суток
  const workStart = timeStringToMinutes(startWork);
  const workEnd = timeStringToMinutes(endWork);
  const meetingStart = timeStringToMinutes(startMeeting);
  const meetingEnd = meetingStart + duration;

  // Проверяем, что встреча начинается не раньше работы и заканчивается не позже конца работы
  return meetingStart >= workStart && meetingEnd <= workEnd;
}
export {isMeetingWithinWorkday};
