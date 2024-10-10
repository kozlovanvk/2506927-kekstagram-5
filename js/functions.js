let chekStringLength = function (string, maxLength) {
  if (string.length > supposedLength) {
    return false;
  }
  return true;
};

let chekPalindrome = function (string) {
  stringWithoutSpaces = string.replaceAll(' ', '');
  reference = stringWithoutSpaces.toLowerCase();
  let reverseString = '';
  for (let i = reference.length - 1; i >= 0; i--) {
    reverseString += reference[i];
  }
  return reverseString === reference;
}
