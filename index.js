'use strict';

const assert = require('assert');

const integerify = module.exports = function(series) {
    assert(series.length, 'series is invaild.');
    series = series.toLowerCase();
    const [vals, lvls, gats] = [
        integerify.values,
        integerify.preset.levels,
        Object.assign([], integerify.preset.gates)
    ];
    let re = new RegExp(`(${ gats.join('|') })$`);
    re.test(series) || (series = `${ series } ${ gats[0] }`);
    re = new RegExp(`((${ gats.join('|') })$|(${ 
        Object.keys(vals).join('|')
    }) ?((${
        Object.keys(lvls).join('|')
    })( |-))?)`, 'g');
    // 对序列分组处理，根据配置的gates分组
    return series.match(new RegExp(`^${ 
        gats.reverse().map(cur => `(.+${ cur })?`).join('') 
    }$`)).slice(1).map(group => {
        if(!group) return 0;
        return group.match(re).reduce((res, cur) => {
            const temp = integerify.parse(cur, vals, lvls);
            return Number.isInteger(temp) ? res + temp : (
                typeof temp == 'function' ? temp(res) : 0
            ); 
        }, 0);
    }).reduce((res, cur) => res + cur);
};

// 解释单元序列的意义，可能是一个整形数或钩子函数
integerify.parse = function(pair, values, levels) {
    pair = pair.replace(/( |-)/g, '');
    let res;
    Object.keys(values).some((vk, i) => {
        let re = new RegExp(`^(${ vk })$`);
        if(re.test(pair)) return ((res = values[vk]) || 1);
        return Object.keys(levels).some(lk => {
            if(!i) {
                re = new RegExp(`^${ lk }$`);
                if(re.test(pair)) return (res = levels[lk]);
            }
            re = new RegExp(`^(${ vk })${ lk }$`);
            re.test(pair) && (res = levels[lk](values[vk]));
            return typeof res !== 'undefined';
        });
    });
    return res;
};

integerify.values = {
    'zero|te': 0,
    'one|elev': 1,
    'two|twel|twen': 2,
    'three|thir': 3,
    'four|for': 4,
    'five|fif': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
};

integerify.preset = {
    levels: {
        '&': val => val,
        'n': val => 10 + val,
        'en': val => 10 + val,
        've': val => 10 + val,
        'teen': val => 10 + val,
        'een': val => 10 + val,
        'ty': val => 10 * val,
        'y': val => 10 * val,
        'hundred': val => 100 * val,
        'thousand': val => 1000 * val,
        'million': val => 1000000 * val
    },
    gates: ['&', 'thousand', 'million']
};

