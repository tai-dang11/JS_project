let robot = lib220.loadImageFromURL( 'https://people.cs.umass.edu/~joydeepb/robot.jpg' );
let copy1 = robot.copy();

function removeBlueAndGreen(img){
  for(let i = 0; i < img.width; ++i ) {
    for ( let j = 0; j < img.height; ++j ) {
      img.setPixel( i, j, [ img.getPixel(i,j)[0] , 0.0 , 0.0 ] );
    }
  }
  return img;
}

let copy2 = robot.copy();
function makeGrayscale(img){
  for(let i = 0; i < img.width; ++i ) {
    for ( let j = 0; j < img.height; ++j ) {
      let m = (img.getPixel(i,j)[0] + img.getPixel(i,j)[1] + img.getPixel(i,j)[2])/3
      img.setPixel( i, j, [ m , m , m ] );
    }
  }
  return img;
}




function red(pixel){
  let newpixel = [pixel[0],0.0,0.0]
  return newpixel
}


function gray(pixel){
  let m = (pixel[0] + pixel[1] + pixel[2])/3
  let newpixel = [m,m,m]
  return newpixel
}


function imageMap(img, func){
  let copy = img.copy();
  for(let i = 0; i < copy.width; ++i ) {
    for ( let j = 0; j < copy.height; ++j ) {
      copy.setPixel(i,j,func(copy.getPixel(i,j)));
    }
  }
  return copy
} 

function mapToRed(img) {
  return imageMap(img, red);
} 

function mapToGrayscale(img) {
  return imageMap(img, gray);
}


test( 'removeBlueAndGreen function definition is correct' , function() {
  const white = lib220.createImage( 10 , 10 , [1,1,1]);
  const pixel = removeBlueAndGreen(white).getPixel(0,0);
  // Need to use assert
  assert(pixel[0] === 1 );
  assert(pixel[1] === 0 );
  assert(pixel[2] === 0 );
} ) ;


test( 'makeGray function definition is correct' , function() {
  const gray = lib220.createImage( 10 , 10 , [1,1,1]);
  const pixel = makeGrayscale(gray).getPixel(0,0);
  // Need to use assert
  assert(pixel[0] === 1 );
  assert(pixel[1] === 1 );
  assert(pixel[2] === 1 );
} ) ;



test('No blue or green in removeBlueAndGreen result ' , function() {
  // Create a test image , of size 10 pixels x 10 pixels , and set it to all white.
  const white = lib220.createImage(10 ,10 , [1 ,1 ,1]);
  // Get the result of the function.
  const shouldBeRed = removeBlueAndGreen(white);
  // Read the center pixel.
  const pixelValue = shouldBeRed.getPixel(5 ,5) ;
  // The red channel should be unchanged.
  assert( pixelValue[0] === 1);
  // The green channel should be 0.
  assert( pixelValue[1] === 0);
  // The blue channel should be 0.
  assert(pixelValue[2] === 0);
});


function pixelEq(p1,p2){
  const epsilon = 0.002;
  for(let i = 0; i < 3; ++i) {
    if (Math.abs(p1[i] - p2[i]) > epsilon){
      return false;
    }
  }
  return true;
};


test (' Check pixel equality ' , function() {
  const inputPixel = [ 0.5 , 0.5 , 0.5 ]
  // Create a test image , of size 10 pixels x 10 pixels , and set it to the inputPixel
  const image = lib220.createImage(10 ,10 ,inputPixel);
  // Process the image.
  const outputImage = removeBlueAndGreen(image);
  // Check the c e n t e r p i x e l .
  const centerPixel = outputImage.getPixel(5,5);
  assert( pixelEq(centerPixel , [0.5, 0, 0]));
  // Check the top−left corner pixel.
  const cornerPixel = outputImage.getPixel(0, 0);
  assert( pixelEq( cornerPixel , [0.5 ,0,0]));
} ) ;



test (' Check gray pixel equality ' , function() {
  const inputPixel = [ .8 , 0.4 , 0.3 ]
  // Create a test image , of size 10 pixels x 10 pixels , and set it to the inputPixel
  const image = lib220.createImage(10 ,10 ,inputPixel);
  // Process the image.
  const outputImage = makeGrayscale(image);
  // Check the c e n t e r p i x e l .
  const centerPixel = outputImage.getPixel(5,5);
  assert( pixelEq(centerPixel , [0.5, 0.5, 0.5]));
  // Check the top−left corner pixel.
  const cornerPixel = outputImage.getPixel(0, 0);
  assert( pixelEq( cornerPixel , [0.5, 0.5, 0.5]));
} ) ;

test (' Check imageMap removeBlueAndGreen ' , function() {
  const inputPixel = [ 0.65 , 0.1 , 0.9 ]
  // Create a test image , of size 10 pixels x 10 pixels , and set it to the inputPixel
  const image = lib220.createImage(15 ,15 ,inputPixel);
  // Process the image.
  const outputImage = mapToRed(image);
  // Check the center pixel.
  const centerPixel = outputImage.getPixel(7,7);
  assert( pixelEq(centerPixel , [0.65, 0, 0]));
  // Check the top−left corner pixel.
  const cornerPixel = outputImage.getPixel(0, 0);
  assert( pixelEq( cornerPixel , [0.65 ,0,0]));
} ) ;


test (' Check imageMap Gray ' , function() {
  const inputPixel = [ 0.45, 0.55, 0.32 ]
  // Create a test image , of size 10 pixels x 10 pixels , and set it to the inputPixel
  const image = lib220.createImage(20 ,20 ,inputPixel);
  // Process the image.
  const outputImage = mapToGrayscale(image);
  // Check the center pixel.
  const centerPixel = outputImage.getPixel(10,10);
  assert(pixelEq(centerPixel , [0.44, 0.44, 0.44]));
  // Check the top−left corner pixel.
  const cornerPixel = outputImage.getPixel(0, 0);
  assert(pixelEq( cornerPixel , [0.44, 0.44, 0.44]));
} ) ;


