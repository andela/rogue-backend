/* eslint-disable arrow-parens */
// eslint-disable-next-line import/prefer-default-export
export const isEmpty = (parameter) => {
  const re = /^$/;
  return re.test(parameter);
};

