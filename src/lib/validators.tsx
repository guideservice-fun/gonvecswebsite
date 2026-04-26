export const validateUTR = (utr: string): boolean => {
  // UTR is typically 12-20 alphanumeric characters
  return /^[A-Z0-9]{10,20}$/.test(utr.toUpperCase());
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 100000;
};

export const validatePhoneNumber = (phone: string): boolean => {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
};

export const validatePincode = (pincode: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(pincode);
};

export const validateUPIID = (upiId: string): boolean => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(upiId);
};
