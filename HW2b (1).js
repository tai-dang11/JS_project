let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robot = lib220.loadImageFromURL(url);

//helper funtions
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

function imageMap(img, pixel){
  let copyimg = img.copy()
  for (let i=0;i<copyimg.width;++i){
    for (let j=0;j<copyimg.height;++j){
      copyimg.setPixel(i,j,pixel(copyimg.getPixel(i,j)));
    }
  }
  return copyimg
}

//6
function blurPixelLeft(img, x, y){
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
  if (x < img.width/2){
    let array = [EdgePixel(img,x-1,y-1), EdgePixel(img,x,y-1),EdgePixel(img,x+1,y-1),
          EdgePixel(img,x-1,y), EdgePixel(img,x,y), EdgePixel(img,x+1,y),
          EdgePixel(img,x-1,y+1),EdgePixel(img,x,y+1),EdgePixel(img,x+1,y+1)];
    let r = Sum(array.map(elem => elem[0]))/9
    let g = Sum(array.map(elem => elem[1]))/9
    let b = Sum(array.map(elem => elem[2]))/9
    return [r, g, b];
  }
  return img.getPixel(x,y);
}

function blurPixelRight(img, x, y){
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
  if (x >= img.width/2){
    let array = [EdgePixel(img,x-1,y-1), EdgePixel(img,x,y-1),EdgePixel(img,x+1,y-1),
          EdgePixel(img,x-1,y), EdgePixel(img,x,y), EdgePixel(img,x+1,y),
          EdgePixel(img,x-1,y+1),EdgePixel(img,x,y+1),EdgePixel(img,x+1,y+1)];
    let r = Sum(array.map(elem => elem[0]))/9
    let g = Sum(array.map(elem => elem[1]))/9
    let b = Sum(array.map(elem => elem[2]))/9
    return [r, g, b];
  }
  return img.getPixel(x,y);
}

//blurHalfImage(img: Image, left: boolean): Image
function blurHalfImage(img, left){
  if (left === true){
    return imageMapXY(img,blurPixelLeft);
  }
  return imageMapXY(img,blurPixelRight);
}

//isGrayish(p: Pixel): boolean
//7
function isGrayish(p){
  if ((Math.max(...p) - Math.min(...p)) > (1/3)){
    return false;
  }
  return true;
}

//8
function gray(pixel){
    if (!isGrayish(pixel)){
    return pixel
  }
  else{
    let m = (pixel[0] + pixel[1] + pixel[2])/3
    let newpixel = [m,m,m]
    return newpixel
  }

}

// makeGrayish(img: Image): Image
function makeGrayish(img){
    function condition(img, x , y){
      return gray(img.getPixel(x,y));
    }
    return imageMapXY(img,condition)
}

//9
//grayHalfImage(img: Image): Image
function grayHalfImage(img){

  function aboveHalf(img, x, y){
    if (y < img.height/2){
      return true;
    }
    return false;
  }

  function Condition(img, x, y){
    if (!aboveHalf(img, x, y)){
      return img.getPixel(x,y)
    }
    return gray(img.getPixel(x,y));
  } 

  return imageMapXY(img,Condition)
}

//10
function saturate(p){
  let rgb = [p[0],p[1],p[2]];
  for (let i  = 0; i< p.length;++i){
    if (p[i] > 2/3){
      rgb[i] = 1;
    }
  }
  return rgb;
}

//saturateHigh(img: Image): Image
function saturateHigh(img) {
  function Condition(img, x, y){
    return saturate(img.getPixel(x,y));
  }
  return imageMapXY(img,Condition);
}


//11
function blacken(p){
  let rgb = [p[0],p[1],p[2]];
  for (let i  = 0; i< p.length;++i){
    if (p[i] < 1/3){
      rgb[i] = 0;
    }
  }
  return rgb;
}


//blackenLow(img:, Image): Image
function blackenLow(img){
  function Condition(img, x, y){
    return blacken(img.getPixel(x,y));
  }
  return imageMapXY(img,Condition);
}

//12
//reduceFunctions(fa: ((p: Pixel) => Pixel)[] ): ((x: Pixel) => Pixel)
function reduceFunctions(fa){
  function combineTwo(f1,f2){
    return x => f1(f2(x))
  }

  return fa.reduce(combineTwo,fa[0]);
}

//13
//contrastGray(img: Image): Image
function contrastGray(img){
  let array = [saturate,blacken,gray]
  return imageMap(img,reduceFunctions(array));
}

function pixelEq (p1, p2) {
  const epsilon = 0.0022;
  for (let i = 0; i < 3; ++i) {
    if (Math.abs(p1[i] - p2[i]) > epsilon) { return false; }  
  }
  return true;
}

//1
test (' Check blurHalfImage ' , function() {
  const img = robot;
  let pixel = blurHalfImage(img,true).getPixel(45,100);
  let pixel2 = blurHalfImage(img,true).getPixel(298,199);
  assert(pixelEq(pixel,[ 0.3058823529411765,0.4718954248366,0.480174291939 ]) === true);
  assert(pixelEq(pixel2,[ 0.4549019607843137,0.5803921568627451,0.5725490196078431 ]) === true);
  } 
);

//2
test (' Check makeGrayish ' , function() {
  const img = robot;
  let pixel = makeGrayish(img).getPixel(22,73);
  let pixel2 = makeGrayish(img).getPixel(160,106);
  assert(pixelEq(pixel,[ 0.41307189542484,0.41307189542484,0.41307189542484 ]) === true);
  assert(pixelEq(pixel2,[0.1568627450980392, 0.1568627450980392, 0.1568627450980392]) === true);

  } 
);

//3
test (' Check blackenLow ' , function() {
  const img = robot;
  let pixel = blackenLow(img).getPixel(24,35);
  let pixel2 =blackenLow(img).getPixel(30,16);
  assert(pixelEq(pixel,[  0.4549019607843137,0.5843137254901961,0.5764705882352941]) === true);
  assert(pixelEq(pixel2,[  0 , 0.43137254901960786, 0.42745098039215684]) === true);
  } 
);

//4
test (' Check saturateHigh ' , function() {
  const img = robot;
  let pixel = saturateHigh(img).getPixel(86,93);
  let pixel2 = saturateHigh(img).getPixel(200,32);
  assert(pixelEq(pixel,[  0.3764705882352941, 0.49019607843137253, 0.4823529411764706 ]) === true);
  assert(pixelEq(pixel2,[1,1,1]) === true);
  } 
);

//5
test (' Check contrastGray ' , function() {
  const img = robot;
  let pixel = contrastGray(img).getPixel(9,68);
  let pixel2 = contrastGray(img).getPixel(5,199);
  assert(pixelEq(pixel,[0,0,0  ]) === true);
  assert(pixelEq(pixel2,[0.54901960784314,0.54901960784314,0.54901960784314  ]) === true);
  } 
);

