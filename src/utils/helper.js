export const returnDate = (newdate, oldDate) => {
  if (newdate) {
    const date = new Date(newdate);
    return date.toLocaleDateString();
  }
  return oldDate;
};

export const generateRandomUser = () => {
  const alphabets = [
    'jude',
    'jane',
    'emeka',
    'tolu',
    'mbakwe',
    'halima',
    'akpan',
    'benjamin',
    'musa',
    'chidinma'
  ];
  const domains = [
    'yahoo.com',
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'cnn.com',
    'mail.com',
    'co.uk',
    'ymail.com',
    'aol.com'
  ];

  const randomNumber1 = Math.floor(Math.random() * 10);
  const randomNumber2 = Math.floor(Math.random() * 10);
  const randomNumber3 = Math.floor(Math.random() * 10);
  const randomNumber4 = Math.floor(Math.random() * 10);
  const domainCom = domains[randomNumber4];

  const firstString = alphabets[randomNumber1];
  const secondString = alphabets[randomNumber2];
  const thirdString = alphabets[randomNumber3];
  // eslint-disable-next-line max-len
  const userEmail = `${firstString}${secondString}${thirdString}${randomNumber1}${randomNumber2}@${domainCom}`;
  return userEmail;
};

