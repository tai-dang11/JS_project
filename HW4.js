let data = lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json');

class FluentRestaurants{
  constructor(jsonData) {
    this.data = jsonData;
  }

  //fromState(stateStr: string): FluentRestaurants
  fromState(stateStr){
    let list = this.data.filter(function(ele){ 
      return ele.state === stateStr
    });
    return new FluentRestaurants(list);
  }

  //ratingLeq(rating: number): FluentRestaurants
  ratingLeq(rating){
    let list = this.data.filter(function(ele){ 
      return ele.stars <= rating;
    });
    return new FluentRestaurants(list);
 
  }

  //ratingGeq(rating: number): FluentRestaurants
  ratingGeq(rating){
    let list = this.data.filter(function(ele){ 
      return ele.stars >= rating;
    });
    return new FluentRestaurants(list);
  }

  //category(categoryStr: string): FluentRestaurants
  category(categoryStr){
    let list = this.data.filter(function(ele){ 
      return ele.categories.includes(categoryStr);
    });
    return new FluentRestaurants(list);
  }

  //hasAmbience(ambienceStr: string): FluentRestaurants
  hasAmbience(ambienceStr){
    let list = this.data.filter(function(ele){
      if(ele.attributes.hasOwnProperty("Ambience")){
        return lib220.getProperty(ele.attributes.Ambience, ambienceStr).found && lib220.getProperty(ele.attributes.Ambience, ambienceStr).value;
      }
      return false;
    });
    return new FluentRestaurants(list);
  }

  // bestPlace(): Restaurant | {}
  bestPlace(){
    if (this.data.length === 0){return {};}
    let arr = [];
    this.data.forEach(e => arr.push(e));
    arr.sort((e1,e2) => e2.stars - e1.stars);
    let sorted = arr.filter(e => e.stars === arr[0].stars);
    return sorted.sort((e1,e2) => e2.review_count - e1.review_count)[0];
  }

  //mostReviews(): Restaurant | {}
  mostReviews(){
    if (this.data.length === 0){return {};}
    let arr = [];
    this.data.forEach(e => arr.push(e));
    arr.sort((e1,e2) => e2.review_count - e1.review_count);
    let sorted = arr.filter(e => e.stars === arr[0].stars);
    return sorted.sort((e1,e2) => e2.stars - e1.stars)[0];
  }
}

const testData = [
  {
    name: "Richmond Town Square",
    city: "Richmond Heights",
    state: "OH",
    stars: 2,
    review_count: 17,
    attributes: {
      RestaurantsPriceRange2: 2,
      BusinessParking: {
        garage: false,
        street: false,
        validated: false,
        lot: true,
        valet: false
      },
      BikeParking: true,
      WheelchairAccessible: true
    },
    categories: [
      "Shopping",
      "Shopping Centers"
    ]
  },
  {
    name: "South Florida Style Chicken & Ribs",
    city: "Charlotte",
    state: "NC",
    stars: 4.5,
    review_count: 4,
    attributes: {
      GoodForMeal: {
        dessert: false,
        latenight: false,
        lunch: false,
        dinner: false,
        breakfast: false,
        brunch: false
      },
      HasTV: false,
      RestaurantsGoodForGroups: true,
      NoiseLevel: "average",
      RestaurantsAttire: "casual",
      RestaurantsReservations: false,
      OutdoorSeating: false,
      Ambience: {
        romantic: false,
        intimate: false,
        classy: false,
        hipster: false,
        divey: false,
        touristy: true,
        trendy: false,
        upscale: false,
        casual: false
      },
      RestaurantsTakeOut: true,
      GoodForKids: true
    },
    categories: [
      "Food",
      "Soul Food",
      "Convenience Stores",
      "Restaurants"
    ]
  },
  {
    name: "Auto Bathouse",
    city: "Pittsburgh",
    state: "PA",
    stars: 5,
    review_count: 25,
    attributes: {
      BusinessAcceptsCreditCards: true
    },
    categories: [
      "Automotive",
      "Oil Change Stations",
      "Car Wash",
      "Auto Detailing"
    ]
  },
  {
    name: "The Tea Emporium",
    city: "Toronto",
    state: "ON",
    stars: 4.5,
    review_count: 7,
    attributes: {
      BusinessParking: {
        garage: false,
        street: true,
        validated: false,
        lot: false,
        valet: false
      },
      WiFi: "no",
      OutdoorSeating: false,
      BusinessAcceptsCreditCards: true,
      RestaurantsPriceRange2: 2,
      BikeParking: true,
      WheelchairAccessible: true
    },
    categories: [
      "Food",
      "Coffee & Tea"
    ]
  },
  {
    name: "TRUmatch",
    city: "Scottsdale",
    state: "AZ",
    stars: 3,
    review_count: 3,
    attributes: {},
    categories: [
      "Professional Services",
      "Matchmakers"
    ]
  },
  {
    name: "Blimpie",
    city: "Phoenix",
    state: "AZ",
    stars: 4.5,
    review_count: 10,
    attributes: {
      RestaurantsTableService: false,
      GoodForMeal: {
        dessert: false,
        latenight: false,
        lunch: false,
        dinner: false,
        breakfast: false,
        brunch: false
      },
      Alcohol: "none",
      Caters: true,
      HasTV: false,
      RestaurantsGoodForGroups: true,
      NoiseLevel: "quiet",
      WiFi: "no",
      RestaurantsAttire: "casual",
      RestaurantsReservations: false,
      OutdoorSeating: false,
      BusinessAcceptsCreditCards: true,
      RestaurantsPriceRange2: 1,
      BikeParking: true,
      RestaurantsDelivery: false,
      Ambience: {
        romantic: true,
        intimate: false,
        classy: false,
        hipster: false,
        divey: false,
        touristy: true,
        trendy: false,
        upscale: false,
        casual: false
      },
      RestaurantsTakeOut: true,
      GoodForKids: true,
      BusinessParking: {
        garage: false,
        street: false,
        validated: false,
        lot: false,
        valet: false
      }
    },
    categories: [
      "Sandwiches",
      "Restaurants"
    ]
  },
    {
    name: "JAB Jewelry Designs",
    city: "McMurray",
    state: "PA",
    stars: 5,
    review_count: 25,
    attributes: {
      DogsAllowed: true,
      BusinessParking: {
        garage: false,
        street: false,
        validated: false,
        lot: true,
        valet: false
      },
      BusinessAcceptsCreditCards: true,
      RestaurantsPriceRange2: 2,
      BikeParking: true,
      ByAppointmentOnly: false,
      WheelchairAccessible: true
    },
    categories: [
      "Jewelry Repair",
      "Gold Buyers",
      "Local Services",
      "Shopping",
      "Appraisal Services",
      "Jewelry"
    ]
  },
  {
    name: "JAB Jewelry Designs",
    city: "McMurray",
    state: "PA",
    stars: 5,
    review_count: 7,
    attributes: {
      DogsAllowed: true,
      BusinessParking: {
        garage: false,
        street: false,
        validated: false,
        lot: true,
        valet: false
      },
      BusinessAcceptsCreditCards: true,
      RestaurantsPriceRange2: 2,
      BikeParking: true,
      ByAppointmentOnly: false,
      WheelchairAccessible: true
    },
    categories: [
      "Jewelry Repair",
      "Gold Buyers",
      "Local Services",
      "Shopping",
      "Appraisal Services",
      "Jewelry"
    ]
  },
  {
    name: "Neighborhood Vision Center",
    city: "Gilbert",
    state: "AZ",
    stars: 5,
    review_count: 50,
    attributes: {
      AcceptsInsurance: true,
      ByAppointmentOnly: true,
      BusinessAcceptsCreditCards: true
    },
    categories: [
      "Health & Medical",
      "Optometrists"
    ]
  },
  {
    name: "Safeway",
    city: "Mesa",
    state: "AZ",
    stars: 5,
    review_count: 50,
    attributes: {
      BusinessParking: {
        garage: false,
        street: false,
        validated: false,
        lot: true,
        valet: false
      },
      Caters: true,
      BusinessAcceptsCreditCards: true,
      RestaurantsPriceRange2: 2,
      BikeParking: true,
      RestaurantsDelivery: false,
      RestaurantsTakeOut: true
    },
    categories: [
      "Flowers & Gifts",
      "Bakeries",
      "Grocery",
      "Shopping",
      "Food",
      "Florists"
    ]
  },
  {
    name: "Applebee's",
    city: "Matthews",
    state: "NC",
    stars: 2,
    review_count: 21,
    attributes: {
      Alcohol: "full_bar",
      HasTV: true,
      NoiseLevel: "average",
      RestaurantsAttire: "casual",
      BusinessAcceptsCreditCards: true,
      Music: {
        dj: false,
        background_music: false,
        no_music: false,
        karaoke: false,
        live: false,
        video: false,
        jukebox: false
      },
      Ambience: {
        romantic: false,
        intimate: false,
        classy: false,
        hipster: false,
        divey: false,
        touristy: false,
        trendy: false,
        upscale: false,
        casual: false
      },
      RestaurantsGoodForGroups: true,
      Caters: false,
      WiFi: "free",
      RestaurantsReservations: false,
      RestaurantsTableService: false,
      RestaurantsTakeOut: true,
      GoodForKids: true,
      HappyHour: true,
      GoodForDancing: false,
      BikeParking: true,
      OutdoorSeating: false,
      RestaurantsPriceRange2: 2,
      RestaurantsDelivery: false,
      GoodForMeal: {
        dessert: false,
        latenight: false,
        lunch: true,
        dinner: false,
        breakfast: false,
        brunch: false
      },
      BusinessParking: {
        garage: false,
        street: false,
        validated: false,
        lot: false,
        valet: false
      },
      CoatCheck: false,
      DriveThru: false
    },
    categories: [
      "Burgers",
      "Bars",
      "Restaurants",
      "Sports Bars",
      "Nightlife",
      "American (Traditional)"
    ]
  },
  {
    name: "Bendix Launderette",
    city: "Edinburgh",
    state: "EDH",
    stars: 5,
    review_count: 25,
    attributes: {
      BusinessAcceptsCreditCards: false,
      RestaurantsPriceRange2: 1,
      WiFi: "no",
      BusinessParking: {
        garage: false,
        street: false,
        lot: false,
        valet: false
      },
      BikeParking: false
    },
    categories: [
      "Laundromat",
      "Laundry Services",
      "Local Services",
      "Dry Cleaning & Laundry"
    ]
  },
  {
    name: "Koko Bakery",
    city: "Cleveland",
    state: "OH",
    stars: 4,
    review_count: 162,
    attributes: {
      BusinessParking: {
        garage: false,
        street: false,
        validated: false,
        lot: true,
        valet: false
      },
      Caters: true,
      WiFi: "free",
      OutdoorSeating: false,
      BusinessAcceptsCreditCards: true,
      RestaurantsPriceRange2: 1,
      BikeParking: true,
      RestaurantsDelivery: false,
      RestaurantsTakeOut: true,
      WheelchairAccessible: true
    },
    categories: [
      "Food",
      "Bakeries",
      "Coffee & Tea"
    ]
  },
  {
    name: "U.S. Bank",
    city: "Las Vegas",
    state: "NV",
    stars: 3.5,
    review_count: 3,
    attributes: {},
    categories: [
      "Financial Services",
      "Banks & Credit Unions"
    ]
  },
  {
    name: "Precision Tune Auto Care",
    city: "Pineville",
    state: "NC",
    stars: 3,
    review_count: 14,
    attributes: {
      BusinessAcceptsCreditCards: true
    },
    categories: [
      "Automotive",
      "Auto Repair",
      "Tires",
      "Oil Change Stations"
    ]
  },
]

test('fromState filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.fromState('NC').data;
  assert(list.length === 3);
  assert(list[0].name === "South Florida Style Chicken & Ribs");
  assert(list[1].name === "Applebee's");
  assert(list[2].name === "Precision Tune Auto Care");

  let list2 = tObj.fromState('OH').data;
  assert(list2.length === 2);
  assert(list2[0].name === "Richmond Town Square");
  assert(list2[1].name === "Koko Bakery");

  let list3 = tObj.fromState('NY').data;
  assert(list3.length === 0);
});

test('ratingLeq and ratingGeq testing', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.ratingLeq(4.5);
  assert(place.data.length === 9);
  let place3 = place.ratingGeq(2.5);
  assert(place3.data.length === 7);
  assert(place3.data[0].name === "South Florida Style Chicken & Ribs");
  assert(place3.data[4].name === "Koko Bakery");
  let place1 = tObj.ratingLeq(2);
  assert(place1.data.length === 2);
});

test('hasAmbience testing', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.hasAmbience('romantic');
  let place2 = tObj.hasAmbience('touristy');
  assert(place.data.length === 1);
  assert(place2.data[1].name === "Blimpie");
});

test('category testing', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.category("Shopping");
  assert(place.data.length === 4);
  assert(place.data[1].name === "JAB Jewelry Designs");
});

test('bestPlace tie-breaking', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.fromState('AZ').bestPlace();
  assert(place.name === "Neighborhood Vision Center");
});

test('mostReview tie-breaking', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.fromState('PA').mostReviews();
  assert(place.name === "Auto Bathouse");
  let place1 = tObj.fromState('EDH').mostReviews();
  assert(place1.name === "Bendix Launderette");
});

