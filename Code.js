// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let classifier;
// Options for the SpeechCommands18w model, the default probabilityThreshold is 0
const options = { probabilityThreshold: 0.7 };
// Two variable to hold the label and confidence of the result
let label;
// Teachable Machine model URL:
let soundModelURL = 'https://teachablemachine.withgoogle.com/models/SecFNbKu/model.json';
let confidence;
// The SketchRNN model
let model;
// Start by drawing
let previous_pen = 'down';
// Current location of drawing
let x, y;
// The current "stroke" of the drawing
let strokePath;

 var models = {};

function preload() {
   // Load the model
  classifier = ml5.soundClassifier(soundModelURL);
    // See a list of all supported models: https://github.com/ml5js/ml5-    library/blob/master/src/SketchRNN/models.js
    models.Dog = ml5.sketchRNN('dog');
    models.Cat = ml5.sketchRNN('cat'); 
}

function setup() {
   createCanvas(640, 480);
  background(220);
  // Create 'label' and 'confidence' div to hold results
  label = createDiv('Label: ...');
  confidence = createDiv('Confidence: ...');
  // Classify the sound from microphone in real time
  classifier.classify(gotResult);
}

// A function to run when we get any errors and the results
function gotResult(error, results) {

  // Display error in the console
  if (error) {
    console.error(error);
  }
  
  // The results are in an array ordered by confidence.
  console.log(results);
  // Show the first label and confidence
  label.html('Label: ' + results[0].label);
  confidence.html('Confidence: ' + nf(results[0].confidence, 0, 2));
  model = models[results[0].label]
  // Round the confidence to 0.01
  
  
  // run sketchRNN
  
  if (nf(results[0].confidence, 0, 2) > .5)
  {startDrawing()}
  
  }

function modelReady() {
  console.log('model loaded');
  startDrawing();
}

// Reset the drawing
function startDrawing() {
  background(220);
  // Start in the middle
  x = width / 2;
  y = height / 2;
  model.reset();
  // Generate the first stroke path
  model.generate(gotStroke);
}

function draw() {
  // If something new to draw
  if (strokePath) {
    // If the pen is down, draw a line
    if (previous_pen == 'down') {
      stroke(0);
      strokeWeight(3.0);
      line(x, y, x + strokePath.dx, y + strokePath.dy);
    }
    // Move the pen
    x += strokePath.dx;
    y += strokePath.dy;
    // The pen state actually refers to the next stroke
    previous_pen = strokePath.pen;

    // If the drawing is complete
    if (strokePath.pen !== 'end') {
      strokePath = null;
      model.generate(gotStroke);
    }
  }
}

// A new stroke path
function gotStroke(err, s) {
  strokePath = s;
}
