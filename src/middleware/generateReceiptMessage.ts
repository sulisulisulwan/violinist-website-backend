export default function generateReceiptMessage(data: any) {
  return `
  Hi ${data.firstName}!
  
  Thank you for visiting my site and leaving a message!  I will get back with you with as a response soon!
  
  -Suliman

  Your message:

  ${data.message}
  `
}