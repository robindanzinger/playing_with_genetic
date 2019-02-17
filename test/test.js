'use strict'
let expect = require('must');

let amount = 10;
let csize = 16;

let variation = Array.from('0123456789abcdefghijklmnopqrstuvwxyz');
let vsize = 36;

function createRandomNumber (max) {
  max = max ? max + 1 : 10
  return Math.floor(Math.random() * max);
}

function createChromosom (indices, vari) {
  vari = vari? vari: vsize;
  indices = indices ? indices : csize;
  let s = '';
  for (let i = 0; i < indices; i++) {
    s += variation[createRandomNumber(vari - 1)];
  }
  return s;
}

function fitness (chromosom, target) {
  let ca = Array.from(chromosom);
  let ta = Array.from(target);
  return ta.filter(function (el, index) {
    return el === ca[index];
  }).length;
}

function cross (mother, father, splitpos) {
  let n = split(mother, splitpos)[0] + split(father, splitpos)[1];
  return n;
}

function split (chromosom, pos) {
  return [chromosom.slice(0, pos), chromosom.slice(pos)];
}

function mutate (chromosom, index, newvalue) {
  let ca = Array.from(chromosom);
  ca[index] = newvalue;
  return ca.join('');
}

function initPop (amount) {
  let population = [];
  for (let i=0; i < amount; i++) {
    population.push(createChromosom());
  }
  return population;
}

function duplicateForPairing (chromosom, fitness) {
  let result = [];
  let amount = Math.pow(2, fitness);
  for( let i = 0; i < amount; i++) {
    result.push(chromosom);
  }
  return result;
}

function nextGen(pop) {
  let newGen = [];
  let popamount = pop.length - 1;
  for (let i = 0; i < amount; i++) {
    let foo = createRandomNumber(popamount);
    let mother = pop[foo];
    if (!mother) console.log(foo, pop);
    let bar = createRandomNumber(popamount);
    let father = pop[bar];
    if (!father) console.log(bar, pop)
    newGen.push(cross(mother, father, createRandomNumber(csize)));
  }
  return newGen.map(function (c) {
    if (createRandomNumber(10) < 1) {
      return mutate(c, createRandomNumber(csize - 1), variation[createRandomNumber(vsize - 1)]);
    }
    return c;
  })
}

function match(pop, result) {
  return pop.find(function (c) {
    if (fitness(c, result) === csize) {
      console.log('found result');
      return true;
    }
    return false;
  });
}

function printBestMatches(pop, result) {
  let bestmatches = new Set();
  pop.forEach(function (c) {
    let f = fitness(c, result);
    if (f > 4) bestmatches.add(f);
  });
  if (bestmatches.size > 0) console.log(bestmatches);
}

function run() {
//  let result = '48279876' + '73560118';
  let result = 'a8279876' + '1h56z118';
//  result = '3278320abcdabc95';
  let pop = initPop(amount);
  let runs = 0;
  while (runs < 500000 && !match(pop, result)) {
    runs == runs++;
    pop = pop.reduce(function (acc, c) {
      let arr = duplicateForPairing(c, fitness(c, result));
      return acc.concat(arr);
    }, []);
    pop = nextGen(pop);
    printBestMatches(pop,result);
  }
}

describe('create a random number', function () {
  it ('returns a number between 0 and 9', function () {
    expect(createRandomNumber(9)).to.be.between(0,10);
  });
});

describe('create chromosom', function () {
  it ('creates 4 digit random number as string', function () {
    expect(createChromosom(4, 10)).to.be.between('0000', '9999');
  });
});

describe('fitnesse function', function () {
  it ('for each correct number fitness function higher value', function () {
    expect(fitness('5555', '1234')).to.be(0);
    expect(fitness('1111', '1234')).to.be(1);
    expect(fitness('3333', '1234')).to.be(1);
    expect(fitness('1333', '1234')).to.be(2);
    expect(fitness('3334', '1234')).to.be(2);
    expect(fitness('9234', '1234')).to.be(3);
    expect(fitness('1235', '1234')).to.be(3);
    expect(fitness('1234', '1234')).to.be(4);
  });
});

describe('crossing two chromosoms', function () {
  it ('crosses two chromosoms', function () {
    expect(cross('1234', '9876', 0)).to.be('9876');
    expect(cross('1234', '9876', 1)).to.be('1876');
    expect(cross('1234', '9876', 2)).to.be('1276');
    expect(cross('1234', '9876', 3)).to.be('1236');
    expect(cross('1234', '9876', 4)).to.be('1234');
  });
});

describe('mutate', function () {
  it ('replaces a value with another', function () {
    expect(mutate('1234', 1, 3)).to.be('1334');
  });
});

describe('create population', function () {
  it ('creates x chromosomes', function ()  {
    expect(initPop(5)).must.have.length(5);
  });
});

describe('duplicate for pairing', function () {
  it ('duplicates chromosomes', function () {
    expect(duplicateForPairing('1234', 0)).must.have.length(1);
    expect(duplicateForPairing('1234', 1)).must.have.length(2);
    expect(duplicateForPairing('1234', 2)).must.have.length(4);
    expect(duplicateForPairing('1234', 3)).must.have.length(8);

  });
});

describe('run', function () {
  it ('run', function () {
    this.timeout(2000000);
    run();
  });
});
