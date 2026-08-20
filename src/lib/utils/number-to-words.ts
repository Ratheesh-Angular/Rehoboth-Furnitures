/**
 * Converts a number to words (Indian numbering system - Lakhs, Crores)
 */

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
const teens = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

function convertLessThanThousand(n: number): string {
  if (n === 0) return "";
  let result = "";
  if (n >= 100) {
    result += ones[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n >= 20) {
    result += tens[Math.floor(n / 10)] + " ";
    n %= 10;
  } else if (n >= 10) {
    result += teens[n - 10] + " ";
    return result.trim();
  }
  if (n > 0) {
    result += ones[n] + " ";
  }
  return result.trim();
}

export function numberToWords(num: number): string {
  if (num === 0) return "Zero Only";
  if (num < 0) return "Minus " + numberToWords(-num);

  const intPart = Math.floor(num);
  const decimalPart = Math.round((num - intPart) * 100);

  let result = "";

  if (intPart >= 10000000) {
    result +=
      convertLessThanThousand(Math.floor(intPart / 10000000)) + " Crore ";
  }
  if (intPart >= 100000 && intPart % 10000000 >= 100000) {
    result +=
      convertLessThanThousand(Math.floor((intPart % 10000000) / 100000)) +
      " Lakh ";
  }
  if (intPart >= 1000 && intPart % 100000 >= 1000) {
    result +=
      convertLessThanThousand(Math.floor((intPart % 100000) / 1000)) +
      " Thousand ";
  }
  if (intPart % 1000 > 0) {
    result += convertLessThanThousand(intPart % 1000) + " ";
  }

  result = result.trim();
  if (decimalPart > 0) {
    result += " and " + convertLessThanThousand(decimalPart) + " Paise Only";
  } else {
    result += " Only";
  }

  return result;
}
