var assert = require('assert');
describe('Table', function () {
    describe('custom paginationCalc function test', function () {
        it('should return 1 2 3 ... 54 - total five including 3-dot item', function () {
            const pagination = (total, currentoriginal) => {
                let shownPages = 5
                let result = []
                let current = currentoriginal + 1
                if (current > total - shownPages) {
                    result.push(total - 2, total - 1, total)
                } else {
                    result.push(current, current + 1, current + 2, '...', total)
                }

                return result
            }

            assert.deepEqual([1, 2, 3, '...', 54], pagination(54, 0));
        });
    });
});