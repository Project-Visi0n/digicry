require("dotenv").config();
const mongoose = require("mongoose");
const Shape = require("../models/Shape");

const shapes = [
  { name: "Circle", path: "M50,25 a25,25 0 1,0 0.00001,0" },
  { name: "Cross", path: "M20,50 L80,50 M50,20 L50,80" },
  { name: "Ellipse", path: "M75,50a25,15 0 1,1-50,0a25,15 0 1,1 50,0" },
  { name: "Isocube", path: "M30,70 L70,70 L70,30 L30,30 Z M30,30 L50,10 L70,30 M70,70 L50,90 L30,70 M50,10 L50,90" },
  { name: "Kite", path: "M50,10 L90,50 L50,90 L10,50 Z" },
  { name: "Lens", path: "M30,50 A20,20 0 0,1 70,50 A20,20 0 0,1 30,50" },
  { name: "Line", path: "M20,80 L80,20" },
  { name: "Omino", path: "M30,30 h40 v40 h-40 Z M50,30 v40" },
  { name: "Polygon", path: "M50,15 L85,85 L15,85 Z" },
  { name: "Polygram", path: "M50,15 L61,85 L15,35 H85 L39,85 Z" },
  { name: "Polyline", path: "M10,90 L30,10 L50,90 L70,10 L90,90" },
  { name: "RadialLines", path: "M50,10 L50,90 M10,50 L90,50 M20,20 L80,80 M80,20 L20,80" },
  { name: "Rect", path: "M20,30 h60 v40 h-60 Z" },
  { name: "RegPolygon", path: "M50,10 L90,35 L73,80 L27,80 L10,35 Z" },
  { name: "RoundedRect", path: "M30,30 h40 a10,10 0 0,1 10,10 v20 a10,10 0 0,1 -10,10 h-40 a10,10 0 0,1 -10,-10 v-20 a10,10 0 0,1 10,-10 Z" },
  { name: "RoundedSquare", path: "M30,30 h40 a10,10 0 0,1 10,10 v20 a10,10 0 0,1 -10,10 h-40 a10,10 0 0,1 -10,-10 v-20 a10,10 0 0,1 10,-10 Z" },
  { name: "Sector", path: "M50,50 L50,10 A40,40 0 0,1 90,50 Z" },
  { name: "Segment", path: "M50,50 L90,50 A40,40 0 0,0 50,10 Z" },
  { name: "Square", path: "M30,30 h40 v40 h-40 Z" },
  { name: "Star", path: "M50,15 L61,35 L85,39 L67,57 L71,81 L50,70 L29,81 L33,57 L15,39 L39,35 Z" },
  { name: "SymH", path: "M20,50 h60 M50,20 v60" },
  { name: "SymI", path: "M50,20 v60" },
  { name: "SymV", path: "M50,20 v60 M20,50 h60" },
  { name: "SymX", path: "M20,20 L80,80 M80,20 L20,80" },
  { name: "Triangle", path: "M50,15 L85,85 L15,85 Z" },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/digicry");
  await Shape.deleteMany({});
  await Shape.insertMany(shapes);
  console.log("Shapes seeded!");
  await mongoose.disconnect();
}

seed();
