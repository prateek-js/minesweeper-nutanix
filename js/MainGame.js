const Game = function(level, els) {
    var els = els || {};
 
    this.levels = {
       beginner: {
          dimension: 9,
          mineCount: 10
       },
       intermediate: {
          dimension: 16,
          mineCount: 40
       },
       advanced: {
          dimension: 21,
          mineCount: 80
       }
    }
 
    var elBoard = els.screen || '.game-board';
    var elTimer = els.timer || '.game-time';
    var elMine = els.mine || '.game-mines-count';
    var elRestartButton = els.restartButton || '.game-restart-button';
    var elLevel = els.level || '.game-level';
    var elStatus = els.status || '.game-status';
 
    this.els = {}
    this.els.board = document.querySelector(elBoard);
    this.els.time = document.querySelector(elTimer);
    this.els.mine = document.querySelector(elMine);
    this.els.restartButton = document.querySelector(elRestartButton);
    this.els.level = document.querySelector(elLevel);
    this.els.elStatus = document.querySelector(elStatus);
 
    this.dimension = 0;
    this.mineCount = 0;
    this.timer = null;
 
    this.setLevel(level);
 
    this.isGameOver = false;
    this.initialize = false;
    this.time = 0;
    this.leftMineCount = this.mineCount;
    this.board = new Board(this.els.board);
 
    this.init();
 }
 
 Game.prototype.setLevel = function(level) {
    var option;
 
    this.dimension = this.levels[level].dimension;
    this.mineCount = this.levels[level].mineCount
 
    option = this.els.level.querySelector('option[value="'+ level +'"]');
    option.selected = true;
 }
 
 Game.prototype.startTimer = function() {
    this.timer = setInterval(function() {
       ++this.time;
       this.els.time.textContent = this.time;
    }.bind(this), 1000);
 }
 
 Game.prototype.stopTimer = function() {
    clearInterval(this.timer);
 }
 
 Game.prototype.init = function() {
    this.isGameOver = false;
    this.time = 0;
    this.els.time.textContent = 0;
    this.els.mine.textContent = this.mineCount;
    this.leftMineCount = this.mineCount;
 
    this.stopTimer();
    this.board.init(this.dimension, this.mineCount);
    
    if (! this.initialize) {
       this.listen();
    }
 
    this.initialize = true;
 }
 
 Game.prototype.isWin = function() {
    return (this.board.getNotReleavedZones().length -1 ) < this.mineCount;
 }
 
 Game.prototype.gameover = function() { 
    this.stopTimer();
    this.isGameOver = true;
    this.board.reveal();
 }
 
 Game.prototype.listen = function() {
    this.els.restartButton.addEventListener('click', this.restartClickHandler.bind(this));
    this.els.level.addEventListener('change', this.levelChangeHandler.bind(this));
    this.board.element.addEventListener('click', this.clickHandler.bind(this));
 }
 
 Game.prototype.restartClickHandler = function() {
    this.init();
 }
 
 Game.prototype.levelChangeHandler = function(event) {
    this.setLevel(event.target.value);
    this.init();
 }
 
 Game.prototype.clickHandler = function(event) {
    if (this.isGameOver || ! event.target.classList.contains('zone')) {
       return;
    }
 
    var zone = this.findZoneByEvent(event);
 
    if (this.time == 0) {
       this.startTimer();
    }
 
    if (zone.isMine) {
       zone.element.classList.add('is-clicked');
       this.els.elStatus.innerHTML = 'Ahh Oh!, You Lost. Retry Game';
       return this.gameover();
    }
 
    zone.reveal();
 
    if (zone.isEmpty) {
       this.board.revealZoneNeighbors(zone);
    }
 
    if (this.isWin()) {
       this.els.elStatus.innerHTML = 'You Won the game, Congrats!';
       return this.gameover();
    }
 }
 
 
 Game.prototype.findZoneByEvent = function(event) {
    var x = event.target.getAttribute('x');
    var y = event.target.getAttribute('y');
    return this.board.zones[y][x];
 }
 
 Game.prototype.decreaseLeftMineCount = function() {
    this.leftMineCount--;
    this.els.mine.textContent = this.leftMineCount;
 }
 
 Game.prototype.increaseLeftMineCount = function() {
    this.leftMineCount++;
    this.els.mine.textContent = this.leftMineCount;
 }