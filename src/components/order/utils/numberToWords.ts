
// Convert a number to words (for invoice amounts)
export const numberToWords = (num: number): string => {
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
  if (num === 0) return 'zero';
  
  const convertLessThanThousand = (num: number): string => {
    if (num < 20) return units[num];
    
    const digit = num % 10;
    if (num < 100) return tens[Math.floor(num / 10)] + (digit ? '-' + units[digit] : '');
    
    const hundred = Math.floor(num / 100);
    return units[hundred] + ' hundred' + (num % 100 ? ' and ' + convertLessThanThousand(num % 100) : '');
  };
  
  let result = '';
  let numStr = num.toString();
  
  // Handle decimal part
  if (numStr.includes('.')) {
    const parts = numStr.split('.');
    numStr = parts[0];
    const decimalPart = parseInt(parts[1]);
    if (decimalPart > 0) {
      result = convertLessThanThousand(parseInt(numStr)) + ' rupees and ' + convertLessThanThousand(decimalPart) + ' paise';
      return result;
    }
  }
  
  // Convert the whole number part
  const numToConvert = parseInt(numStr);
  if (numToConvert < 1000) {
    result = convertLessThanThousand(numToConvert);
  } else if (numToConvert < 100000) {
    result = convertLessThanThousand(Math.floor(numToConvert / 1000)) + ' thousand' + 
             (numToConvert % 1000 ? ' ' + convertLessThanThousand(numToConvert % 1000) : '');
  } else {
    result = convertLessThanThousand(Math.floor(numToConvert / 100000)) + ' lakh' + 
             (numToConvert % 100000 ? ' ' + convertLessThanThousand(numToConvert % 100000) : '');
  }
  
  return result + ' rupees only';
};
