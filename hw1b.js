let robot = lib220.loadImageFromURL('https://people.cs.umass.edu/~joydeepb/robot.jpg') ;

function highlightEdges(img){
  let copyimg = img.copy();
  for (let i=0;i<copyimg.width;++i){
    for (let j=0;j<copyimg.height-1;++j){
      let arr1 = img.getPixel(i,j);
      let arr2 = img.getPixel(i,j+1);
      let m1 = (arr1[0]+arr1[1]+arr1[2])/3;
      let m2 = (arr2[0]+arr2[1]+arr2[2])/3;
      let abs = Math.abs(m1-m2);
      copyimg.setPixel(i,j,[abs,abs,abs]);
    }
  }
  return copyimg;
}




function blur(img){
  function EdgePixel(img, x,y){
  if(x===-1 || y===-1 || x>=img.width || y>=img.height){ 
     return [0,0,0];
  }
  return img.getPixel(x,y);
  }

  function Sum(arr){
    let s=0;
    for (let i =0;i<arr.length;++i){
      s+=arr[i];
    }
    return s;
  }

  function meanNeighbor(img, x, y){
    let array = [EdgePixel(img,x-1,y-1), EdgePixel(img,x,y-1),EdgePixel(img,x+1,y-1),
          EdgePixel(img,x-1,y), EdgePixel(img,x,y), EdgePixel(img,x+1,y),
          EdgePixel(img,x-1,y+1),EdgePixel(img,x,y+1),EdgePixel(img,x+1,y+1)];
    let r =  Sum(array.map(elem => elem[0]))/9
    let b = Sum(array.map(elem => elem[2]))/9
    let g =Sum(array.map(elem => elem[1]))/9
    return [r, g, b];
  
  }

  let copyImg = img.copy();
  for (let i=0;i<copyImg.width;++i){
    for (let j=0;j<copyImg.height;++j){
      copyImg.setPixel(i,j, meanNeighbor(img, i,j));
    }
  }
  return copyImg;
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

function swapgreBlu (rgb){
  return [rgb[0],rgb[2],rgb[1]]
}

function swapGB(img){
  let swapGBImg = imageMap(img, swapgreBlu);
  return swapGBImg;
}

function shift (rgb){
  return [rgb[2],rgb[0],rgb[1]]
}

function shiftRGB(img){
  let shiftRGBimg = imageMap(img, shift);
  return shiftRGBimg;
}


function pixelEq(p1,p2){
  const epsilon = 0.002;
  for(let i = 0; i < 3; ++i) {
    if (Math.abs(p1[i] - p2[i]) > epsilon){
      return false;
    }
  }
  return true;
};

test (' Check blur ' , function() {
  const img = robot;
  let pixel = blur(img).getPixel(2,24);
  assert(pixelEq(pixel,[ 0.24444444444444 , 0.19041394335512 , 0.1442265795207 ]) === true);
  } 
);


test (' Check shiftRGB ' , function() {
  const pur = lib220.createImage( 40 , 40 , [ .5 , .1 , .9 ] ) ;
  let pixel = shiftRGB(pur).getPixel(25,13);
  assert(pixelEq(pixel,[ .9 , .5 , .1 ]) === true);
  
  } 
);




test (' Check swapGB ' , function() {
  const img = lib220.createImage( 30 , 15 , [ .12 , .3 , .4 ] ) ;
  let pixel = swapGB(img).getPixel(25,13);
  assert(pixelEq(pixel,[ .12 , .4 , .3 ]) === true);
  } 
);



test (' Check highlightEdges ' , function() {
  const img = robot;
  let pixel = highlightEdges(img).getPixel(25,13);
  assert(pixelEq(pixel,[0.01437908497,0.01437908497,0.01437908497]) === true);
  } 
);
