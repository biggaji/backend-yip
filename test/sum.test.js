import { sum } from '../sum.js';
import { assert, expect } from 'chai';

describe('Sum function', () => {
  it('The datatype of the sum result should be a number', (done) => {
    const result = sum([1, 3, 5, 8]);
    assert.typeOf(result, 'number');
    done();
  });

  it('The sum of the result should equal 17', (done) => {
    const result = sum([1, 3, 5, 8]);
    assert.equal(result, 17);
    done();
  });

  // it('The sum of these operation to throw a TypeError', (done) => {
  //   const result = sum([1, 'r', 5, 8]);
  //   expect(sum([1, 'r', 5, 8])).to.throw(
  //     `Param must contain only values of type 'number'`,
  //   );
  //   done();
  // });
});
