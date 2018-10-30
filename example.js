'use strict';

const integerify = require('./index');

// 根据需要, 现在要拓展解释器的可解释数量级范围十亿级(billion)和万亿级(trillion)

Object.assign(integerify.preset.levels, {
    'billion': val => 1000000000 * val,
    'trillion': val => 1000000000000 * val
});

integerify.preset.gates.push(
    'billion', 'trillion'
);

console.log(integerify('zero'));
console.log(integerify('two million three hundred six thousand forty-two'));
console.log(integerify('five hundred twenty-three billion and sixty-one million seven hundred and two thousand'));
console.log(integerify('thirty-one trillion seven hundred sixty million thousand one hundred fifteen'));
console.log(integerify('eleven trillion five hundred twelve billion and two thousand'));