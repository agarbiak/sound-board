const soundsElement = document.querySelector('#sounds');
const stopButton = document.querySelector('#stopButton');
const players = [];

let keyCodes = ["1", "2", "3", "4", "5", "6", "7", "8"];

stopButton.addEventListener('click', stopAll);

(async () => {
  const sounds = await getSounds();
  addSoundsToPage(sounds);
})();

async function getSounds() {
  const response = await fetch('./sounds.json');
  const json = await response.json();
  return json;
}

function addSoundsToPage(sounds) {
  sounds.forEach(addSoundToPage);
  listenKeyPress();
}

function addSoundToPage(sound, index) {
  const soundDiv = document.createElement('div');
  soundDiv.className = 'sound';
  const soundTitle = document.createElement('h2');
  soundTitle.textContent = sound.title;
  soundDiv.appendChild(soundTitle);

  const player = document.createElement('audio');
  player.setAttribute('src', `sounds/${sound.src}`)
  soundDiv.appendChild(player);
  players.push({
    player,
    soundDiv
  });

  soundDiv.addEventListener('mousedown', () => {
    soundPress(soundDiv, player);
  });

  soundDiv.addEventListener('mouseup', () => {
    soundDiv.style.background = '';
  });

  soundsElement.appendChild(soundDiv);
}

function soundPress(div, player) {
  div.style.background = '#A9A9A9';
  player.currentTime = 0;
  player.play();
}

function listenKeyPress() {
  document.addEventListener('keydown', (event) => {
    if (event.key == " " || event.key == "s") return stopAll();
    const playerIndex = keyCodes.indexOf(event.key);
    const playerAndDiv = players[playerIndex];
    if (playerAndDiv && !playerAndDiv.keydown) {
      playerAndDiv.keydown = true;
      soundPress(playerAndDiv.soundDiv, playerAndDiv.player);
    }
  });

  document.addEventListener('keyup', (event) => {
    const playerIndex = keyCodes.indexOf(event.key);
    const playerAndDiv = players[playerIndex];
    if (playerAndDiv) {
      playerAndDiv.soundDiv.style.background = '';
      playerAndDiv.keydown = false;
    }
  });
}

function stopAll() {
  players.forEach(({
    player
  }) => {
    player.pause();
  });
}