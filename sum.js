/**
 *
 * @param {Array<number>} figList
 * @returns {number} Sum of the numbers
 */
const sum = (figList) => {
  try {
    for (let i = 0; i < figList.length; i++) {
      if (typeof figList[i] !== 'number') {
        throw new TypeError("Param must contain only values of type 'number'");
      }
    }

    return figList.reduce((a, c) => {
      return a + c;
    });
  } catch (error) {
    throw error;
  }
};

export { sum };
