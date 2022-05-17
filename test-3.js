function ValFinder(state, name) {
  if (lib220.getProperty(state, name).found) {
    return lib220.getProperty(state, name).value;
  }
  else {
    if (lib220.getProperty(state, 'nextScope').found) {
      return ValFinder(state.nextScope, name);
    }
    else {
      return null;
    }
  }
  return null;
}

//1
function interpExpression(state,e){
  if (e.kind === 'number') {
      return e.value;
  } 
  else if (e.kind === 'boolean') {
      return e.value;
  } 
  else if (e.kind === 'operator') {
    let v1 = interpExpression(state, e.e1);
    let v2 = interpExpression(state, e.e2);
    if (typeof(v1) !== typeof(v2)){
      console.log("Must be same type");
      assert(false);
    }

    if (e.op === '+') {
      return  v1 + v2;
    }
    else if (e.op === '-') {
      return v1 - v2;
    }
    else if (e.op === '*') {
      return v1 * v2;
    }
    else if (e.op === '/') {
      return v1 / v2;
    }
    else if (e.op === '>') {
      return v1 > v2;
    }
    else if (e.op === '<') {
      return v1 < v2;
    }
    else if (e.op === '===') {
      return v1 === v2;
    }
    else if (e.op === '||') {
      return v1 || v2;
    }
    else if (e.op === '&&') {
      return v1 && v2;
    }
    else{
      console.log("invalid binop");
    }
  }
  else if (e.kind === 'variable') {
    let value = ValFinder(state, e.name);
    if (value === null) { console.log('Variable not declared.');
      assert(false);
    }
    return value;

  }
  else {
    console.log("Invalid Expr");
    assert(false);
  }
}

function StateFinder(state, name) {
  if (lib220.getProperty(state, name).found) { return state;}
  else {
    if (lib220.getProperty(state, 'nextScope').found) {
      return StateFinder(state.nextScope, name);
    }
    else {return null;}
  }
  return null;
}

//2
function interpStatement(state, p){
  let arr = [];
  arr.unshift(state);
  
  function interpBlock(state,s){
    let scope = {};
    arr.unshift(scope);
    lib220.setProperty(scope, 'nextScope', state);
    s.forEach(e => interpStatement(arr[0],e));
    arr.shift();
  }
  let type = p.kind;
  if (type === 'let'){
    if (arr.length === 0){
      arr = arr.unshift(state);
    }
    
    if (lib220.getProperty(state, p.name).found) {
      console.log("variable already declared");
      assert(false);
    }
    let value = interpExpression(state, p.expression);
    lib220.setProperty(state, p.name, value);
  }

  else if (type === 'assignment'){
      let curState = StateFinder(arr[0], p.name);
      if (curState === null) {
        console.log('variable not declared');
        assert(false);
      };
      let value = interpExpression(arr[0], p.expression);
      lib220.setProperty(curState, p.name, value); 
  }

  else if (type === 'print'){
    console.log(interpExpression(state, p.expression));
  }

  else if (type === 'if'){
    let values = interpExpression(state, p.test);
    if (values) {
      interpBlock(state, p.truePart);
    } else {
      interpBlock(state, p.falsePart);
    }
  }

  else if (type === 'while'){
    let modifiedAST = { 
      kind: 'if',
      test: p.test,
      truePart: p.body.concat(p),
      falsePart: []
    };
    interpStatement(state, modifiedAST);
  }
  else{
    console.log('invalid statement');
    assert(false);
  }
}

function interpStatementV2(state, p,array){
  function interpBlock(state,s){
    let scope = {};
    array.unshift(scope);
    lib220.setProperty(scope, 'nextScope', state);
    s.forEach(e => interpStatementV2(array[0],e,array));
    array.shift();
  }

  let type = p.kind;
  if (type === 'let'){
    if (array.length === 0){
      array = array.unshift(state);
    }
    if (lib220.getProperty(state, p.name).found) {
      console.log("variable already declared");
      assert(false);
    }
    let value = interpExpression(state, p.expression);
    lib220.setProperty(state, p.name, value);
  }

  else if (type === 'assignment'){
      let curState = StateFinder(array[0], p.name);
      if (curState === null) {
        console.log('variable not declared');
        assert(false);
      };
      let value = interpExpression(array[0], p.expression);
      lib220.setProperty(curState, p.name, value); 
  }

  else if (type === 'print'){
    console.log(interpExpression(state, p.expression));
  }

  else if (type === 'if'){
    let values = interpExpression(state, p.test);
    if (values) {
      interpBlock(state, p.truePart);
    } else {
      interpBlock(state, p.falsePart);
    }
  }

  else if (type === 'while'){
    let modifiedAST = { 
      kind: 'if',
      test: p.test,
      truePart: p.body.concat(p),
      falsePart: []
    };
    interpStatementV2(state, modifiedAST,array);
  }

  else{
    console.log('invalid statement');
    assert(false);
  }

}

//3
function interpProgram(p){
  let arrl = [];
  let s = {};
  arrl.unshift(s);
  p.forEach(e => interpStatementV2(s, e, arrl));
  return s;
}

test("interpExpression with a variable", function() {
  assert(interpExpression({ x: 2 }, parser.parseExpression("x + 5").value)=== 7);
  assert(interpExpression({ x: 3 }, parser.parseExpression("x - 9").value) === -6);
  assert(interpExpression({ x: 15 }, parser.parseExpression("x * 3").value) === 45);
  assert(interpExpression({ x: 56 }, parser.parseExpression("x / (56*2)").value) === 0.5);
  assert(interpExpression({ x: true, y:false}, parser.parseExpression("x || y").value) === true);
  assert(interpExpression({ x: 22 }, parser.parseExpression("x > 2").value) === true);
  assert(interpExpression({ x: 21 }, parser.parseExpression("x < 20").value) === false);
  assert(interpExpression({ x: 35 }, parser.parseExpression("x === 20").value) === false);
});

test("assignment", function() {
  let st = interpProgram(parser.parseProgram("let x = 10; x = 20;").value);
  let st1 = interpProgram(parser.parseProgram("let x = 10; let y = 20; x = x + y; y = 21;").value);
  assert(st.x === 20);
  assert(st1.x === 30);
  assert(st1.y === 21);
});

let program = 
"let nterms = 7;"+
"let nOne = 0;"+
"let nTwo = 1;"+
"let count = 0;"+
"if (nterms === 1){"+
  "print(nOne);"+
"} else{ "+
  "while (count < nterms) {"+
    "print(nOne);"+
    "let nth = nOne + nTwo;"+
    "nOne = nTwo;"+
    "nTwo = nth;"+
    "count = count + 1;"+
  "}"+
"}"
let p = parser.parseProgram(program);
// interpProgram(p.value);
// interpStatement({nterms:7, nOne:0,nTwo:1,count:0},p.value[4]);
