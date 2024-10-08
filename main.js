import {generateLabyrinth} from './generate.js';
import {renderBlocky, renderHairline} from './render.js';

const renderStyleEl = document.getElementById('render-style');
const labyrinthEl = document.getElementById('labyrinth-el');

let labyrinth;

function regenerate() {
  console.time('regenerate');
  const width = (window.innerWidth >> 5) - 1;
  const height = (window.innerHeight >> 5) - 1;
  labyrinth = generateLabyrinth(width, height);
  switch (renderStyleEl.textContent) {
    case 'hairline':
      renderHairline(labyrinth);
      break;
    case 'blocky':
      renderBlocky(labyrinth);
      break;
  }
  console.timeEnd('regenerate');
}

labyrinthEl.addEventListener('click', regenerate);
regenerate();

renderStyleEl.addEventListener('click', () => {
  console.time('rerender');
  switch (renderStyleEl.textContent) {
    case 'hairline':
      renderStyleEl.textContent = 'blocky';
      renderBlocky(labyrinth);
      break;
    case 'blocky':
      renderStyleEl.textContent = 'hairline';
      renderHairline(labyrinth);
      break;
  }
  console.timeEnd('rerender');
});