
// Helper function to convert number to words
export function convertToWords(amount: number): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", 
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", 
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  
  const numString = Math.floor(amount).toString();
  
  if (amount < 20) {
    return ones[amount];
  }
  
  if (amount < 100) {
    return tens[Math.floor(amount / 10)] + (amount % 10 ? " " + ones[amount % 10] : "");
  }
  
  if (amount < 1000) {
    return ones[Math.floor(amount / 100)] + " Hundred" + (amount % 100 ? " And " + convertToWords(amount % 100) : "");
  }
  
  if (amount < 100000) {
    return convertToWords(Math.floor(amount / 1000)) + " Thousand" + (amount % 1000 ? " " + convertToWords(amount % 1000) : "");
  }
  
  if (amount < 10000000) {
    return convertToWords(Math.floor(amount / 100000)) + " Lakh" + (amount % 100000 ? " " + convertToWords(amount % 100000) : "");
  }
  
  return convertToWords(Math.floor(amount / 10000000)) + " Crore" + (amount % 10000000 ? " " + convertToWords(amount % 10000000) : "");
}
