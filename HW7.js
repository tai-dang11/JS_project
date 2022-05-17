//generateInput(n: number): number[][]. //to generate random number
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class FSA{
  constructor(){

    let currentState = undefined;
    let memento = undefined;
    let Statetransitions = []; // array contains all the States in FSA

    class State{
      //constructor(name: string)
      constructor(name){
        let identity = name;
        let connected = []; // array contains which states are connected to

        // this.connected = [];
        this.getName = () => {
          return identity;
        }

        //setName(s: string)
        this.setName = (s) => {
          identity = s;
          return this;
        }

        //addTransition(e: string, s: State):
        this.addTransition= (e, s) => {
          let f = {};
          lib220.setProperty(f,"event",e)
          lib220.setProperty(f,"to",s)
          connected.push(f)
          return this;
        }

        //nextState(e: string)
        this.nextState = (e) => {
          let arr = connected.filter(ele => ele.event === e);
          if (arr.length === 0) {return undefined;}
          if (arr.length === 1){return arr[0].to;}
          let random = randomInt(0,arr.length);
          return arr[random].to;
        }

        //nextStates(e: string)
        this.nextStates = (e) => {
          if (connected.length === 0) {return connected;}
          let arr = connected.filter(ele => ele.event === e);
          arr = arr.map(e => e.to);
          return arr;
        }

        // clear all the transition for the state
        this.clearTranstion = () => {
          connected = [];
        }
      }
    }

    class Memento{
      constructor(){
        let state = undefined;
        // storeState(s: string)
        this.storeState = (s) => {state = s;}
        this.getState = () => {return state};
      }
    }

    this.createState = (s,transitions) => {
      let checkExisted = findState(s,Statetransitions); //check if a state already created
      if (checkExisted !== null){ //if already created, clear all previous transitions
        checkExisted.clearTranstion();
      }
      if (currentState === undefined) { //if currentState not created, then set currentState
        currentState = new State(s);
        Statetransitions.push(currentState);
      }
      for (let i = 0; i < transitions.length; ++i){
        let event = Object.keys(transitions[i])[0].toString();
        let str = lib220.getProperty(transitions[i],event).value;
        let checkState = findState(str,Statetransitions)
        let cur = findState(s,Statetransitions)
        if (cur === null){ // check if state S already created
          cur = new State(s);
          Statetransitions.push(cur);
        }
        if (checkState === null){ // check if transition state already created
          let newState = new State(str);
          cur.addTransition(event,newState);
          Statetransitions.push(newState);
        }
        else{
          cur.addTransition(event,checkState);
        }
      }
      return this;
    }
  
    //nextState(e: string)
    this.nextState = (e) => {
      if (currentState !== undefined) {
        currentState = currentState.nextState(e);
      }
      return this;
    }

    this.showState = () => {
      if (currentState === undefined) {return undefined;}
      return currentState.getName()
    }

    //addTransition(s: string, t: Transition)
    this.addTransition = (s,t) => {
      let stateToFind = findState(s,Statetransitions); 
      if (stateToFind === null) {  // if state s does not exist, all create state on s
        let arr = [];
        arr.push(t)
        this.createState(s,arr);
      }
      else{
        let event = Object.keys(t).toString();
        let str = lib220.getProperty(t,event).value;
        let existState = findState(str,Statetransitions);
        if (existState !== null){ // if state in transition exists, add trsnition between s and that state
          stateToFind.addTransition(event,existState);
        } 
        else { // if not, add state in transition to Statetransitions
          let newState = new State(str);
          stateToFind.addTransition(event,newState);
          Statetransitions.push(newState);
        }
      }
      return this;
    }

    //renameState(name: string, newName: string)
    this.renameState = (name,newName) => {
      let stateToFind = findState(name, Statetransitions);
      if (stateToFind !== null) {
        stateToFind.setName(newName);
      }
      return this;
    }

    this.createMemento = () => {
      let newMemento = new Memento();
      newMemento.storeState(this.showState());
      memento = newMemento; //set current memento to newMemento
      return memento;
    }

    //restoreMemento(m: Memento)
    this.restoreMemento = (m) => {
      let name = m.getState();
      if (name !== undefined){
        let stateToFind = findState(name,Statetransitions);
        if (stateToFind !== null){
          currentState = stateToFind;
        }
      }
      return this;
    }

    // function to find state with the name in Statetranscitions 
    let findState = (name,arr) => {
      for( let i = 0; i < arr.length; ++i) {
        if (arr[i].getName() === name) {return arr[i]}
      }
      return null;
    }

  }
} 

test (' Testing FSA ' , function() {
  let myMachine = new FSA()
  let restoreTo = myMachine.createMemento()
  myMachine.addTransition("delicates, low", {temp:"normal, high"})
  .createState("normal, low", [{mode: "delicates, low"}, {temp: "normal, medium"}]) 
  .createState("delicates, low", [{mode: "normal, low"}, {temp: "delicates, medium"}])
  .createState("delicates, medium", [{mode: "normal, medium"},{temp: "delicates, low"}])
  .createState("normal, medium", [{mode: "delicates, medium"},{temp: "normal, high"}])

  let x = myMachine.showState()
  assert(x === "delicates, low")
  myMachine.restoreMemento(restoreTo);
  let f = myMachine.showState();
  assert(f === "delicates, low")

  myMachine.nextState("temp")
  .nextState("mode")
  let restoreTo1 = myMachine.createMemento()
  myMachine.nextState("mode")
  let y = myMachine.showState()
  assert(y === "delicates, medium")

  myMachine.restoreMemento(restoreTo1);
  let z = myMachine.showState()
  assert(z === "normal, medium")

  let restoreTo2 = myMachine.createMemento()
  myMachine.renameState("normal, medium", "medium")
  let a = myMachine.showState()
  assert(a === "medium")
  myMachine.restoreMemento(restoreTo2);
  let d = myMachine.showState();
  assert(d === "medium")

  myMachine.addTransition("medium", {key: "high"})
  .nextState("key")
  let b = myMachine.showState()
  assert(b === "high")

  myMachine.nextState("temp")
  let c = myMachine.showState()
  assert(c === undefined)
});



