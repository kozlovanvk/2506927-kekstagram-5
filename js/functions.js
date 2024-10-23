let chekStringLength = function (string, maxLength) {
  if (string.length > maxLength) {
    return false;
  }
  return true;
};

let chekPalindrome = function (string) {
  let stringWithoutSpaces = string.replaceAll(' ', '');
  let reference = stringWithoutSpaces.toLowerCase();
  let reverseString = '';
  for (let i = reference.length - 1; i >= 0; i--) {
    reverseString += reference[i];
  };
  return reverseString === reference;
};
