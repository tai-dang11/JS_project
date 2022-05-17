let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robot = lib220.loadImageFromURL(url);

//1
function imageMapXY(img, func){
  let copy = img.copy();
  for (let i = 0; i< img.width;++i){
    for (let j = 0; j<img.height;++j){
        let pixel = func(copy,i,j);
        copy.setPixel(i,j,pixel);
    }
  }
  return copy;
} 

//2
function imageMask(img, cond, maskValue){
    function condition(img,x,y){
      if (!cond(img,x,y)){
        return img.getPixel(x,y);
      }
      return maskValue;
    }
    return imageMapXY(img,condition);
}

//3
function imageMapCond(img, cond, func){

    function condition(img,x,y){
      if (cond(img,x,y) === false){
        return img.getPixel(x,y);
      }
      return func(img.getPixel(x,y));
    }

    return imageMapXY(img,condition);
}

//4
function blurPixel(img, x, y){
  function Sum(arr){
    let s=0;
    for (let i =0;i<arr.length;++i){
      s+=arr[i];
    }
    return s;
  }

  function EdgePixel(img, x,y){
    if(x ===-1 || y ===-1 || x >= img.width || y>=img.height){ 
        return [0,0,0];
    }
    return img.getPixel(x,y);
  }

  let array = [EdgePixel(img,x-1,y-1), EdgePixel(img,x,y-1),EdgePixel(img,x+1,y-1),
        EdgePixel(img,x-1,y), EdgePixel(img,x,y), EdgePixel(img,x+1,y),
        EdgePixel(img,x-1,y+1),EdgePixel(img,x,y+1),EdgePixel(img,x+1,y+1)];
  let r = Sum(array.map(elem => elem[0]))/9
  let g = Sum(array.map(elem => elem[1]))/9
  let b = Sum(array.map(elem => elem[2]))/9
  return [r, g, b];
}

//5
function blurImage(img){
  return imageMapXY(img, blurPixel);
}

//testing
function pixelEq(p1,p2){
  const epsilon = 0.004;
  for(let i = 0; i < 3; ++i) {
    if (Math.abs(p1[i] - p2[i]) > epsilon){
      return false;
    }
  }
  return true;
};

//test1
test (' Check imageMapXY ' , function() {
  const img = robot;
  let pixel = imageMapXY(img, function(img, x, y) { return [img.getPixel(x, y)[0], 0, 0];}).getPixel(25,13);
  assert(pixelEq(pixel,[robot.getPixel(25,13)[0],0,0]) === true);
  } 
);

//test2
test (' Check imageMask ' , function() {
  let pixel = [0.3,0.5,0.6]
  const img = lib220.createImage(100, 100, pixel);
  let image = imageMask(img, function(img,x,y){ return (y % 15 === 0);},[0,1,0]);
  assert(pixelEq(image.getPixel(10,15),[0,1,0]) === true);
  assert(pixelEq(image.getPixel(6,90),[0,1,0]) === true);
  } 
);

//test3
test (' Check blurImage ' , function() {
  const img = robot;
  let pixel = blurImage(img).getPixel(24,35);
  assert(pixelEq(pixel,[ 0.45098039215686 , 0.5843137254901961 , 0.57429193899782 ]) === true);
  } 
);
