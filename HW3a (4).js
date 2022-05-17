//generateInput(n: number): number[][]
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

// oracle(f: (companies: number[][], candidates: number[][]) => Hire[]): void
function oracle(f) {
  let numTests = 50; // Change this to some reasonably large value
  for (let i = 0; i < numTests; ++i) {
    let n = 10; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let hires = f(companies, candidates);
    console.log("Companies see candidate: ");console.log(companies);
    console.log("Candidates see companies: "); console.log(candidates);
    console.log(hires);

    test('Hires length is correct', function() {
      assert(companies.length === hires.length);
    }); // Write more tests like this one

  //helper functions
  //get the index of company given the candidate
  function getCanPref(company, candidate){
    return candidates[candidate].indexOf(company);
  }

  //from hires, we can get better choice given a candidate
  function higherCandidateRanking(can,company){
    let array = [];
    for (let i = 0; i < companies[company].length; ++i){
      if (companies[company][i] === can){
        return array;
      }
      array.push(companies[company][i]);
    }
    return array;
  }

//pseudo code for CoupleStable for all hire
//for com in company:
//  for can in [can com would prefer over current_partner(com)]:
//    if candidate prefers com to current_partner(candidate) 
//      return false
// return true

  function CoupleStable(hire){
    let candidate = hire.candidate;
    let company = hire.company;
    let preferedCandidates = higherCandidateRanking(candidate,company);
    if (preferedCandidates.length !== 0){
      for (let i = 0; i < preferedCandidates.length; ++i){
        let can = preferedCandidates[i];
        let indexToCheck = getCanPref(company,can);
        let companyMatchIndex = 0;

        for (let i = 0; i < hires.length; ++i){
          if (hires[i].candidate === can){
            companyMatchIndex = getCanPref(hires[i].company,can);
          }
        }
        if (indexToCheck < companyMatchIndex){
            return false;
          }
        }
      return true;
    }
    return true;
  }

  hires.forEach((hire) => {
    test("Test couple stable or not", function(){
    assert(CoupleStable(hire) === true);
    })
  })
  
  }
}

// oracle(wheat1);
// oracle(chaff1);


