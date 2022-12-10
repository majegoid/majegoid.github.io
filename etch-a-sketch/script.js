'use strict';

// constants
const SQUARES_CONTAINER_SIDE_LENGTH_REM = 60;
const ROW_WIDTH = '100%';
// state
let numSquaresPerSide = 16;
let drawColor = '#000000';
// computed properties
let rowHeight = SQUARES_CONTAINER_SIDE_LENGTH_REM / numSquaresPerSide;

// function element references
const squaresContainer = findAndUpdateSquaresContainerDiv();

// function to create a new SquaresContainer
function createSquaresContainer(numSquares) {
  numSquaresPerSide = numSquares;
  rowHeight = SQUARES_CONTAINER_SIDE_LENGTH_REM / numSquaresPerSide;
  for (let r = 0; r < numSquaresPerSide; r++) {
    let rowDiv = createRowDiv();
    for (let c = 0; c < numSquaresPerSide; c++) {
      let square = createSquareDiv();
      square.addEventListener('mouseover', () => updateSquareBackgroundColor(square, drawColor));
      rowDiv.appendChild(square);
    }
    squaresContainer.appendChild(rowDiv);
  }
}

function resetSquaresContainer(newSize = numSquaresPerSide) {
  squaresContainer.replaceChildren();
  createSquaresContainer(newSize);
}

// function to create each element
function findAndUpdateSquaresContainerDiv() {
  let squaresContainer = document.querySelector('.squares');
  squaresContainer.style.height = `${SQUARES_CONTAINER_SIDE_LENGTH_REM}rem`;
  squaresContainer.style.width = `${SQUARES_CONTAINER_SIDE_LENGTH_REM}rem`;
  return squaresContainer;
}

function createRowDiv() {
  let rowDiv = document.createElement('div');
  rowDiv.classList.add('square-row');
  rowDiv.style.height = `${rowHeight}rem`;
  rowDiv.style.width = ROW_WIDTH;
  return rowDiv;
}

function createSquareDiv() {
  let square = document.createElement('div');
  square.classList.add('square');
  square.style.height = `${rowHeight}rem`;
  square.style.width = `${rowHeight}rem`;
  return square;
}

function setDrawColorToRandom() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  // turn numbers into hex strings
  r = r.toString(16).padStart(2, '0');
  g = g.toString(16).padStart(2, '0');
  b = b.toString(16).padStart(2, '0');

  drawColor = `#${r}${g}${b}`;
}

function setDrawColorToBlack() {
  drawColor = `#000000`;
}

function updateSquareBackgroundColor(square, drawColor) {
  square.style.backgroundColor = drawColor;
}

function runScript() {
  createSquaresContainer(numSquaresPerSide);
  // set up random
  // set-draw-color-to-random-button
  let setDrawColorToRandomButton = document.querySelector('#set-draw-color-to-random-button');
  setDrawColorToRandomButton.addEventListener('click', () => setDrawColorToRandom());
  // set-draw-color-to-black-button
  let setDrawColorToBlackButton = document.querySelector('#set-draw-color-to-black-button');
  setDrawColorToBlackButton.addEventListener('click', () => setDrawColorToBlack());
  // set up resetSquaresContainerButton
  let resetSquaresContainerButton = document.querySelector('#reset-squares-container-button');
  resetSquaresContainerButton.addEventListener('click', () => {
    // prompt user for input
    let userGridSize = undefined;
    // continue looping if input is not valid in type, value, or range
    while (
      typeof userGridSize !== 'number' ||
      Number.isNaN(userGridSize) ||
      userGridSize < 1 ||
      userGridSize > 100
    ) {
      userGridSize = prompt('Enter a whole number width to create a new grid between 1 and 100:');
      userGridSize = +userGridSize;
      if (typeof userGridSize === 'number' && !Number.isNaN(userGridSize)) {
        // round floating point numbers to the nearest whole number
        userGridSize = Math.round(userGridSize);
      }
    }
    resetSquaresContainer(userGridSize);
  });
}

runScript();
