export const luhnCheck = ((lookUpArr: number[]) => {
  return (cardNumber: string): boolean => {
    const num = cardNumber.replace(/[\D\s]/g, '');
    let len = num.length,
      bit = 1,
      sum = 0,
      val;
    while (len) {
      val = parseInt(num.charAt(--len), 10);
      // eslint-disable-next-line no-cond-assign
      sum += (bit ^= 1) ? lookUpArr[val] : val;
    }
    return sum ? sum % 10 === 0 : false;
  };
})([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]);

export default {
  luhnCheck,
};
