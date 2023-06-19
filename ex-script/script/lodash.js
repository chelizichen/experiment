const lodash = require('lodash')

/**
 * @method difference 
 *        找出不一样的值
 *      可以通过ids进行比较
 */

// let a = [1, 2, 3]
// let b = [1, 2]

// const diff_data = lodash.difference(a, b)
// console.log(diff_data); // [ 3 ]



/**
 * @method differenceBy(Origin:Array,Target,Function)
 *        找出不一样的值
 *       找出对象中不一样的值
 */

// let a_1 = [{ 'a': 2 }, { a: 1, }]
// let b_1 = [{ 'a': 1 }]

// const diff_data1 = lodash.differenceBy(a_1, b_1, 'a')
// console.log(diff_data1); // [ { a: 2 } ]


/**
 * @method differenceWith
*/

// const objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 
// const data = lodash.differenceWith(objects, [{ 'x': 1, 'y': 2 }], lodash.isEqual);
// console.log(data);
// => [{ 'x': 2, 'y': 1 }]


/**
 * @method pull(array,[values])
*/

// const array = [1, 2, 3, 4, 5, 6];
// let data = lodash.pull(array, 2, 3);
// console.log(data); // [ 1, 4, 5, 6 ]
// console.log(data == array); // true

/**
 * @method pullAll(array,values)
 */
const array = [1, 2, 3, 1, 2, 3];
const data = lodash.pullAll(array, [2, 3]);
console.log(data);  // [ 1, 1 ]
console.log(data == array); // true



