function checkStringLength(string, maxLength) {
  return string.length <= maxLength;
}

checkStringLength('проверяемая строка', 20);

function isPalindrome(string) {
  const cleanString = string.toLowerCase().replaceAll(' ', '');
  const reversedString = cleanString.split('').reverse().join('');
  return cleanString === reversedString;
}

isPalindrome('топот');
