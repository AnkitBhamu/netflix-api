// // good thing to understand classes and objects

// const { model } = require("mongoose");

// var b = {
//   name: "Ankit",
// };

// class Model {}

// class temp {
//   constructor() {
//     this.a = 5;
//     this.b = function hello() {
//       console.log("hello");
//       this.a = b;
//     };
//   }
// }

// function Fruit(color, taste, seeds) {
//   this.color = color;
//   this.taste = taste;
//   this.seeds = seeds;
// }

// // Create an object
// const fruit1 = new Fruit("Yellow", "Sweet", 1);

// // Display the result
// console.log(fruit1);

// let obj = new temp();
// let obj2 = new obj.b();
// console.log(obj2);

// b.name = "Ankit11";

// console.log(obj2);
// console.log();
// console.log(new temp());

function express() {
  return {
    name: "ankit kumar",
    use: () => {
      console.log("hello there");
    },
  };
}

let val = express();
val.use();
