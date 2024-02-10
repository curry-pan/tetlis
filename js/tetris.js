const intro = new Audio('Korobushka_0.mp3');
intro.muted = false;
intro.volume=1;
const bgm = new Audio('Korobushka_1.mp3');
bgm.muted = false;
bgm.volume = 1;
bgm.loop = true;

var BLOCK_CLASSES = [
  'empty',
  'blue',
  'green',
  'white',
  'pink',
  'red',
  'orange',
  'cyan'
];
var BLOCK_TYPE = [
  [
    [1,1],
    [1,1]
  ],
  [
    [2,2,2,2],
  ],
  [
    [3,3,0],
    [0,3,3]
  ],
  [
    [0,4,4],
    [4,4,0]
  ],
  [
    [5,0],
    [5,5],
    [5,0]
  ],
  [
    [6,6],
    [6,0],
    [6,0]
  ],
  [
    [7,0],
    [7,0],
    [7,7]
  ],
];

var COUNT_X_BLOCK = 10;
var COUNT_Y_BLOCK = 20;

function play() {
  const cnt = document.getElementsByClassName("game");
  if(cnt){
    var sco = document.getElementsByClassName("score");
    for(var i = 0;i < cnt.length;i++){
      cnt[i].style.display = "none";
      sco[i].style.display = "none";
    }
    intro.pause();
    bgm.pause();
    intro.currentTime = 0;
    bgm.currentTime = 0;
    clearTimeout(music2);
  }
  var btn = document.getElementsByClassName("btn");
  document.getElementById("logo").style.display = "none";

  for(var i = 0;i < btn.length;i++){
    btn[i].style.display = "none";
  }
  intro.play();
  var music2 = setTimeout(function(){
    bgm.play();
  },4030);
  var field = document.querySelector(".field");
  var fields = [];

  var exist_blook = [];
  var random;
  var hold = 0;
  var score = 0;
  var time = 1000;

  for(var x = 0; x < COUNT_X_BLOCK; x++) {
    fields.push(Array(COUNT_Y_BLOCK));
  }
  for(var x = 0; x < COUNT_X_BLOCK; x++) {
    for(var y = 0; y < COUNT_Y_BLOCK; y++) {
      fields[x][y] = 0;
    }
  }

  var fallingBlock;
  var fallingBlockPos;
  selectNext();

  var timer = setTimeout(function(){
    fall();
  },time);
  
  function fall(){
    clearTimeout(timer);
    timer = setTimeout(function(){
      fall();
    },time);
    if(!getFall()) {
      nextFall();
      return;
    }
    fallingBlockPos.y += 1;
      drawBlock();
  }
  function qfall(){
    while(getFall()){
        fallingBlockPos.y += 1;
        score += 1;
    }
    nextFall();
    drawBlock();
  }

  function clearBlocks(){
    for(var y = 0; y < COUNT_Y_BLOCK; y++) {
      var isClearable = true;
      for(var x = 0; x < COUNT_X_BLOCK; x++) {
        if(!fields[x][y]){
          isClearable = false;
        }
      }
      if(!isClearable) {
        continue;
      }
      score += 200;
      time -= Math.min(2,time*0.002);
      for(var y2 = y - 1; y2 >= 0; y2--) {
        for(var x = 0; x < COUNT_X_BLOCK; x++) {
          fields[x][y2 + 1] = fields[x][y2];
        }
      }
    }
  }

  function getFall() {
    if(fallingBlockPos.y + fallingBlock[0].length >= COUNT_Y_BLOCK ) {
      return false;
    }
    for(var x = 0; x < fallingBlock.length; x++) {
      for(var y = 0; y < fallingBlock[x].length; y++) {
        if(!fallingBlock[x][y]) {
          continue;
        }
        if(!fields[x + fallingBlockPos.x][y + fallingBlockPos.y + 1]) {
          continue;
        }
        return false;
      }
    }

    return true;
  }
  
  function getMovable(value) {
    if(fallingBlockPos.x + fallingBlock.length + value > COUNT_X_BLOCK ) {
      return false;
    }
    if(fallingBlockPos.x + value < 0 ) {
      return false;
    }
    for(var x = 0; x < fallingBlock.length; x++) {
      for(var y = 0; y < fallingBlock[x].length; y++) {
        if(!fallingBlock[x][y]) {
          continue;
        }
        if(!fields[x + fallingBlockPos.x + value][y + fallingBlockPos.y]) {
          continue;
        }
        return false;
      }
    }
    return true;
  }

  function nextFall(){
    fallBlock();
    clearBlocks();
    if(!selectNext()) {
      clearTimeout(timer);
    }
    drawBlock();
  }

  function selectNext() {
    if(exist_blook.length >= 7){
        exist_blook = [];
    }
    do{
        random = Math.floor(Math.random() * BLOCK_TYPE.length);
    }while((exist_blook.includes(random)))
    exist_blook += random;
    time -= Math.min(1,time*0.002);
    return createNext();
  }
  function createNext(){
    clearTimeout(timer);
    timer = setTimeout(function(){
      fall();
    },time);
    time -= Math.min(1,time*0.002);
    fallingBlock = BLOCK_TYPE[random];
    fallingBlockPos = {x: Math.floor((COUNT_X_BLOCK - fallingBlock.length) / 2), y: 0};
    var isGameOver = false;
    for(var x = 0; x < fallingBlock.length; x++) {
      for(var y = 0; y < fallingBlock[x].length; y++) {
        if(!fallingBlock[x][y]) {
          continue;
        }
        if(!fields[x + fallingBlockPos.x][y + fallingBlockPos.y]) {
          continue;
        }
        isGameOver = true;
        break;
      }
    }
    if(isGameOver) {
      drawBlock();
      clearTimeout(timer);
      document.body.innerHTML += "<p class='game'>GAME OVER</p>";
      document.body.innerHTML += "<p class='score'>SCORE:"+score+"</p>";
      document.body.innerHTML += "<a class='btn' onclick='play();'>CONTINUE?</a>";
      return false;
    }
    return true;
  }
  function fallBlock() {
    for(var x = 0; x < fallingBlock.length; x++) {
      for(var y = 0; y < fallingBlock[0].length; y++) {
        if(!fallingBlock[x][y]) {
          continue;
        }
        fields[x + fallingBlockPos.x][y + fallingBlockPos.y] = fallingBlock[x][y];
      }
    }
    fallingBlock = [[]];
  }
  
  drawBlock();
  function getBlock(x, y) {
    if(fields[x][y] == 0) {
      if( x - fallingBlockPos.x >= 0 &&
          y - fallingBlockPos.y >= 0 &&
          x - fallingBlockPos.x < fallingBlock.length &&
          y - fallingBlockPos.y < fallingBlock[0].length) {
        return fallingBlock[x - fallingBlockPos.x][y - fallingBlockPos.y];
      } else {
        return fields[x][y];
      }
    } else {
      return fields[x][y];
    }
  }
  function drawBlock() {
    field.innerHTML = "";
    for(var y = 0; y < COUNT_Y_BLOCK; y++) {
      for(var x = 0; x < COUNT_X_BLOCK; x++) {
        var blockDiv = document.createElement("div");
        blockDiv.className = "block " + BLOCK_CLASSES[getBlock(x, y)];
        field.appendChild(blockDiv);
      }
    }
  }
  function getRotate() {
    var oldfallingBlock = fallingBlock;
    var newfallingBlock = [];
    for(var x = 0; x < oldfallingBlock[0].length; x++) {
      newfallingBlock.push(Array(oldfallingBlock.length));
    }
    if(newfallingBlock.length + fallingBlockPos.x > COUNT_X_BLOCK) {
      return false;
    }
    if(newfallingBlock[0].length + fallingBlockPos.y > COUNT_Y_BLOCK) {
      return false;
    }
    for(var x = 0; x < newfallingBlock.length; x++) {
      for(var y = 0; y < newfallingBlock[x].length; y++) {
        newfallingBlock[x][y] = 
          oldfallingBlock[y][oldfallingBlock[0].length-x-1];
      }
    }
    for(var x = 0; x < newfallingBlock.length; x++) {
      for(var y = 0; y < newfallingBlock[x].length; y++) {
        if(!newfallingBlock[x][y]) {
          continue;
        }
        if(!fields[x + fallingBlockPos.x][y + fallingBlockPos.y]) {
          continue;
        }
        return false;
      }
    }
    return true;
  }
  window.addEventListener("keydown", function(e){
    switch(e.keyCode) {
      case 39:
        if(getMovable(1)) {
          fallingBlockPos.x += 1;
          drawBlock();
        }
        break;
      case 37:
        if(getMovable(-1)) {
          fallingBlockPos.x -= 1;
          drawBlock();
        }
        break;
    case 40:
        if(getFall()) {
          score += 1
          fall();
        }
        break;
    case 38:
        if(getFall()) {
          score += 5
          qfall();
        }
        break;
    case 67:
        if(getRotate()) { //c right
            var oldfallingBlock = fallingBlock;
            fallingBlock = [];
            for(var x = 0; x < oldfallingBlock[0].length; x++) {
            fallingBlock.push(Array(oldfallingBlock.length));
            }
            for(var x = 0; x < fallingBlock.length; x++) {
            for(var y = 0; y < fallingBlock[x].length; y++) {
                fallingBlock[x][y] = oldfallingBlock[y][oldfallingBlock[0].length-x-1];
            }
            }
            drawBlock();
        }
        break;
    case 77: //m left
        if(getRotate()) {
            var oldfallingBlock = fallingBlock;
            fallingBlock = [];
            for(var x = 0; x < oldfallingBlock[0].length; x++) {
            fallingBlock.push(Array(oldfallingBlock.length));
            }
            for(var x = 0; x < fallingBlock.length; x++) {
            for(var y = 0; y < fallingBlock[x].length; y++) {
                fallingBlock[x][y] = oldfallingBlock[fallingBlock[0].length - y - 1][x]
            }
            }
            drawBlock();
        }
        break;
    case 32: //space hold
        if(!hold){
            hold = random;
            clearBlocks();
            selectNext();
        }else{
            var w = hold;
            hold = random;
            random = w;
            createNext();
        }
        break;
    }
  });
}