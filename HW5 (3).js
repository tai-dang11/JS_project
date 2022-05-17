// //helper functions
function snode(head, tail) {
  return { isEmpty: () => false,
  head: () => head, 
  tail: tail.get,
  toString: () => "snode(" + head.toString() + ", " + tail.toString() + ")",
  map: f => snode(f(head), memo0(() => tail.get().map(f))),
  filter: f => f(head) ? snode(head, memo0(() => tail.get().filter(f))) : tail.get().filter(f)
  }
};

let sempty = { isEmpty: ()=>true, toString: ()=>'sempty',
map: f => sempty, filter: f => sempty };

function memo0(f) {
  let r = { evaluated: false };
  return { get: function() {
    if (! r.evaluated) {
      r = { evaluated: true, v: f() }
    }
    return r.v;
  },
    toString: function() {
      return r.evaluated ? r.v.toString() : '<unevaluated>';
    } 
  };
}

function sappend(left, right) {
  if (left.isEmpty()) {
    return right();
  } 
  else {
    return snode(left.head(), memo0(() => sappend(left.tail(), right)));
  }
}

//1
function addSeries(f,g){
  if (f.isEmpty() && g.isEmpty()) {return sempty;}

  if (f.isEmpty()) {return snode(g.head(), memo0(() => addSeries(f, g.tail())));}

  if (g.isEmpty()) { return snode(f.head(), memo0(() => addSeries(f.tail(), g)));}

  return snode(f.head() + g.head(), memo0(() => addSeries(f.tail(),g.tail())));
}

//2
function prodSeries(f,g){ 
  let y3 = snode(0,memo0(() => sempty));

  function proHelper(y1,y2,y3){
    if (y1.isEmpty()) {return y3;}
    let a0 = y1.head();
    function multiply(n,s){
      if (s.isEmpty()){ return sempty;}
      return snode(s.head() * n, memo0(() => multiply(n,s.tail())));
    }
    let f = multiply(a0,y2);
    let finalStream = snode(addSeries(f,y3).head(), memo0(() => sempty));
    y3 = addSeries(f,y3).tail();
    return sappend(finalStream, () => proHelper(y1.tail(), y2, y3));
  }
  return proHelper(f,g,y3);
}

//3
function derivSeries(s){
  if (s.tail().isEmpty()) {return snode(0,memo0(() => sempty));}
  function deri(f,i){
    if (f.isEmpty()) {return sempty;}
    return snode(f.tail().head()*i, memo0(() => deri(f.tail(),++i)));
  } 
  return deri(s,1);
}

//4
function coeff(s,n){
  let list = [];
  let i = 0;
  function coeHelper(f,n,arr,i){
    if (f.isEmpty()) {return arr;}
    if (i === n+1){return;}
    arr.push(f.head());
    coeHelper(f.tail(),n,arr,++i);
    return arr
  }
  return coeHelper(s,n,list,0);
}

//5
function evalSeries(s,n){
  let list = [];
  let i = 0;
  return function (x){
    function Helper(f,n,arr,i){
      if (f.isEmpty()) {return arr;}
      if (i === n+1){return;}
      arr.push(f.head() * Math.pow(x,i));
      Helper(f.tail(),n,arr,++i);
      return arr
    }
    let array = Helper(s,n,list,0);
    return array.reduce((acc,e) => acc + e, 0);
  }
}

//6
function rec1Series(f,v){
  return snode(v, memo0(() => rec1Series(f,f(v))));
}

//7
function factorial(num) {
  if (num < 0) {
        return -1;}
  else if (num === 0) {
      return 1;}
  else {
      return (num * factorial(num - 1));
  }
}

function expSeries(){  
  let left = snode(1,memo0(() => sempty));
  let remain = rec1Series(x => (x+1), 1);
  let reverse = sappend(left,() => remain);
  return reverse.map(x => 1/factorial(x));
}

//8
function arrTostream(arr){
  function gen(i){
    if(i === arr.length){
      return sempty;
    }
    else{
      return snode(arr[i], memo0(() => gen(++i)));
    }
  }
  return gen(0);
}

function addCoef(arr1,arr2){
  let total = 0;
  for (let i = 0; i < arr1.length; ++i){
    total += arr1[i]*arr2[i];
  }
  return total;
}

function recurSeries(coef, init){
  let a = arrTostream(init);

  function nextStream(coe,ini){
    let total = addCoef(coe,ini);
    ini.shift();
    ini.push(total);
    return snode(total, memo0(() => nextStream(coe,ini)));
    return total;
  }
  return sappend(a, () => nextStream(coef,init));
}

//testing
function NumEq(p1,p2){
  const epsilon = 0.00004;
  if (Math.abs(p1 - p2) > epsilon){
      return false;
  }
  return true;
};

function memofrom(n) {
  return snode(n, memo0(() => memofrom(n + 1)));
}

function memofrom2(n) {
  return snode(n, memo0(() => memofrom2(n * 3)));
}

test ('Testing expSeries, evalSeries and rec1Series', function(){
  let exp = evalSeries(expSeries(),200);
  let exp1 = evalSeries(expSeries(),200);
  let exp2 = evalSeries(expSeries(),200);
  assert(NumEq(exp(1),Math.E));
  assert(NumEq(exp1(0),1));
  assert(NumEq(exp2(9),Math.pow(Math.E,9)));
});

test ('Testing derivSeries', function(){
  let s1 = memofrom(1);
  let deri = derivSeries(s1);
  let s = snode(9,memo0(() => sempty));
  assert(deri.head() === 2);
  assert(deri.tail().tail().tail().head() === 20);
  assert(derivSeries(s).head() === 0);
});

test ("Testing addSeries and prodSeries", function(){
  let s1 = memofrom(1);
  let s2 = memofrom2(2);
  let adds = addSeries(s1,s2);
  let pro = prodSeries(s1,s2);
  assert(adds.head() === 3);
  assert(adds.tail().tail().tail().head() === 58);
  assert(pro.head() === 2);
  assert(pro.tail().tail().tail().head() === 116);
});

test(" Testing coeff ", function(){
  let s1 = memofrom(1);
  let s = coeff(s1,6);
  assert(s[0] === 1);
  assert(s[5] === 6);
});

test(" Testing recurSeries ", function(){
  let s = recurSeries([1,2,3],[15,9,2]);
  assert(s.tail().head() === 9);
  assert(s.tail().tail().tail().head() === 39);
  assert(s.tail().tail().tail().tail().head() === 130);
});