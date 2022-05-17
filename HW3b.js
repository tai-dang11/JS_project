//helper
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//function generateInput(n: number)
function generateInput(n){
  function RanArray(n){
    let temp = [];
    for (let i = 0; i < n; ++i){
      temp.push(i);
    }
    let arr = []
    for (let i = 0; i < n; ++i){
      const index = randomInt(0, n-i);
      arr.push(temp.splice(index,1)[0]);
    }
    return arr;
  }
  let matrix = [];
  for (let i = 0; i < n; ++i){
    matrix.push(RanArray(n));
  }
  return matrix;
}

// match the couple if there is no better offer
function getMatch(hires, index, cond) {
  if (hires.length === 0 || index < 0) { return -1; }
  let party = -1;
  hires.forEach(function(e) {
    if (cond) {
      if (index === e[0]) { party = e[1];}
    } 
    else {
      if (index === e[1]) { party = e[0];}
    }
  });
  return party;
}

// check if trace out in out 
function contain(hires, com, can) {
  if (hires.length === 0) { return false; }
  let result = false;
  hires.forEach(function(lst) {
    if (com === lst[0] && can === lst[1]) {
      result = true;
    }
  });
  return result;
}

// check if current is prefered
function preferOverCurrent(a, b , curPartner, list) {
  if (a < 0 || b < 0 || curPartner < 0) { return false; }
  let indexCheck = list[a].indexOf(b);
  let indexPartner = list[a].indexOf(curPartner);
  return  indexPartner > indexCheck;
}

//get index of the better offer
function getIndexOfPref(hires, index, isCo) {
  if (hires.length === 0) { return -1; }
  let result = -1;
  for (let i = 0; i < hires.length; ++i) {
    if (isCo && index === hires[i][0]) {
      result = i;
      break;
    } 
    else if (!isCo && index === hires[i][1]) {
      result = i;
      break;
    }
  }
  return result;
}

function OuttoArr(out){
  let arr = []
  for (let i = 0; i < out.length; ++i){
    arr.push([out[i].company,out[i].candidate]);
  }
  return arr;
}

function runOracle(f) {
  let numTests = 20; // Change this to some reasonably large value
  for (let i = 0; i < numTests; ++i) {
    let n = 9; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let run = f(companies, candidates);
    let trace = run.trace;
    let result = true;
    let canCheck = [];
    let comCheck = [];
    for (let i = 0; i < n; ++i){
      canCheck.push(-1);
      comCheck.push(-1)
    }
    let hires = [];
    trace.forEach(function(lst) {

      let match = [];
      if (lst.fromCo) {
        if (companies[lst.from].indexOf(lst.to) !== comCheck[lst.from] + 1) {
          result = false;
        }
        comCheck[lst.from] = comCheck[lst.from] + 1;
        match = [lst.from,lst.to];
      } 
      else {
        if (candidates[lst.from].indexOf(lst.to) !== canCheck[lst.from] + 1) {
          result = false;
        } 
        canCheck[lst.from] = canCheck[lst.from] + 1; 
        match = [lst.to, lst.from];
      }

      let party = getMatch(hires, lst.to, !lst.fromCo);
      let cond = preferOverCurrent(lst.to, party, lst.from, lst.fromCo ? candidates : companies)
      if (!cond) {
        let index = getIndexOfPref(hires, lst.to, !lst.fromCo);
        if (index !== -1) {
          hires.splice(index, 1);
        }
        hires.push(match);
      }
    })

    test(" test result = true", function(){
      assert(result);
    })

    test(" test equal length", function(){
      assert(hires.length === run.out.length);
      
    })

    // test(" test hires length", function(){
    //   assert(hires.every(lst => contain(OuttoArr(run.out), lst.company, lst.candidate)));
      
    // })

    // console.log(contain(OuttoArr(run.out));
  }
}

const oracleLib = require('oracle');
runOracle(oracleLib.traceWheat1);
// runOracle(oracleLib.traceChaff1);
