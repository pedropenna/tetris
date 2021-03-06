(function() {
  'use strict';

  window.tetris = {};

  var Game = window.tetris.game = function(canvas) {
    console.log('new game', canvas);

    this.canvas = canvas;
    this.ctx = self.canvas.getContext('2d');
    console.log('ctx', self.ctx);

    this.initGame();
  };

  Game.BLOCK_SIZE = 30;

  Game.score = 0;

  Game.linesCleared = 0;

  Game.prototype.drawGrid = function() {
    // console.log('draw grid');
    this.ctx.beginPath();
    this.ctx.strokeStyle  = 'gray';
    this.ctx.rect(0, 0, this.canvas.width - 1, this.canvas.height - 1);
    this.ctx.stroke();
    this.ctx.strokeStyle  = 'rgb(210, 210, 230)';
    this.ctx.beginPath();

    var rightBorderX = (this.ctx.canvas.width / 2) + (10 * Game.BLOCK_SIZE / 2);
    var leftBorderX = (this.ctx.canvas.width / 2) - (10 * Game.BLOCK_SIZE / 2);
    var y = 10;

    for (var x1 = leftBorderX; x1 <= rightBorderX; x1 += Game.BLOCK_SIZE) {
      this.ctx.moveTo(x1, y);
      this.ctx.lineTo(x1, y + (20 * Game.BLOCK_SIZE));
      this.ctx.stroke();
    }

    for (var y1 = y; y1 <= y + (20 * Game.BLOCK_SIZE); y1 += Game.BLOCK_SIZE) {
      this.ctx.moveTo(leftBorderX, y1);
      this.ctx.lineTo(rightBorderX, y1);
      this.ctx.stroke();
    }
  };

  Game.INTERVAL_ID = 0;

  Game.prototype.initGame = function() {
    console.log('init game');

    this.setupKeyListeners();

    for (var i = 1; i <= 20; i++) {
      var row = [];
      for (var j = 1; j <= 10; j++) {
        row.push(0);
      }
      Game.rows.push(row);
    }

    this.spawnNewPiece();
    Game.PIECE_COORDINATES = {x: 4, y: 0};

    this.repaint();

    Game.INTERVAL_ID = window.setInterval(this.step.bind(this), 1000);
  };

  Game.prototype.setupKeyListeners = function() {
    var self = this;

    document.onkeydown = function(event) {
      // console.log('key', event.keyCode);

      switch (event.keyCode) {
        case 37: /* left */
        case 65: /* a */
          if (!self.checkCollision(Game.PIECE_COORDINATES.x - 1,
                                   Game.PIECE_COORDINATES.y)) {
            Game.PIECE_COORDINATES.x--;
          }
          break;
        case 39: /* right */
        case 68: /* d */
          if (!self.checkCollision(Game.PIECE_COORDINATES.x + 1,
                                   Game.PIECE_COORDINATES.y)) {
            Game.PIECE_COORDINATES.x++;
          }
          break;
        case 38: /* up */
        case 87: /* w */
          var rotatedPiece = self.rotatePiece();
          if (!self.checkCollision(Game.PIECE_COORDINATES.x,
                                   Game.PIECE_COORDINATES.y,
                                   rotatedPiece)) {
            Game.PIECE_SPRITE = rotatedPiece;
          }
          break;
        case 83: /* down */
        case 40: /* s */
          if (!self.checkIfPieceWillCollide()) {
            Game.PIECE_COORDINATES.y++;
          }
          break;
        case 32: /* space */
          var lowestPoint = Game.PIECE_COORDINATES.y;
          for (var i = Game.PIECE_COORDINATES.y;
                    i < Game.rows.length; i++) {
            if (self.checkCollision(Game.PIECE_COORDINATES.x, i)) {
              break;
            } else {
              lowestPoint = i;
            }
          }
          Game.PIECE_COORDINATES.y = lowestPoint;
          break;
      }
    };
  };

  Game.prototype.rotatePiece = function() {
    var newSprite = [];
    for (var j = 0; j < Game.PIECE_SPRITE[0].length; j++) {
      var newRow = [];
      newSprite.push(newRow);
      for (var i = Game.PIECE_SPRITE.length - 1; i >= 0; i--) {
        newRow.push(Game.PIECE_SPRITE[i][j]);
      }
    }

    return newSprite;
  };

  Game.rows = [];

  Game.prototype.checkIfPieceWillCollide = function() {
    var nextY = Game.PIECE_COORDINATES.y + 1;

    var collided = this.checkCollision(Game.PIECE_COORDINATES.x,
                                       Game.PIECE_COORDINATES.y + 1);

    if (collided) {
      console.log('collided!');

      this.solidifyPiece();

      this.spawnNewPiece();
    }
  };

  Game.prototype.spawnNewPiece = function() {
    if (!Game.NEXT_PIECE) {
      Game.PIECE_SPRITE = this.createNewPiece();
    } else {
      Game.PIECE_SPRITE = Game.NEXT_PIECE;
    }
    Game.NEXT_PIECE = this.createNewPiece();

    Game.PIECE_COORDINATES = {x: 4, y: -1};

    if (this.checkCollision(Game.PIECE_COORDINATES.x, 0)) {
      this.endGame();
      Game.PIECE_SPRITE = [0];
    }
  };

  Game.prototype.createNewPiece = function() {
    var newPiece;

    var randomNumber = parseInt(Math.floor(Math.random() * 7));
    switch (randomNumber) {
      case 0:
        newPiece = [[1, 1],
                    [1, 1]];
        break;
      case 1:
        newPiece = [[2, 2, 2, 2]];
        break;
      case 2:
        newPiece = [[0, 3],
                    [3, 3],
                    [3, 0]];
        break;
      case 3:
        newPiece = [[4, 0],
                    [4, 4],
                    [0, 4]];
        break;
      case 4:
        newPiece = [[0, 5, 0],
                    [5, 5, 5]];
        break;
      case 5:
        newPiece = [[6, 6],
                    [6, 0],
                    [6, 0]];
        break;
      case 6:
        newPiece = [[7, 7],
                    [0, 7],
                    [0, 7]];
        break;
      default:
        alert('invalid piece number' + randomNumber);
        break;
    }

    return newPiece;
  };

  Game.prototype.endGame = function() {
    console.log('endGame');
    window.clearInterval(Game.INTERVAL_ID);
    window.alert('Game Over');
  };

  Game.prototype.solidifyPiece = function() {
    for (var k = 0; k < Game.PIECE_SPRITE.length; k++) {
      for (var m = 0; m < Game.PIECE_SPRITE[0].length; m++) {
        var spriteBlockCode = Game.PIECE_SPRITE[k][m];
        if (spriteBlockCode != 0) {
          Game.rows[k + Game.PIECE_COORDINATES.y]
                    [Game.PIECE_COORDINATES.x + m] = spriteBlockCode;
        }
      }
    }

    this.clearCompleteRows();
  };

  Game.prototype.clearCompleteRows = function() {
    var completeRows = [];
    for (var i = 0; i < Game.rows.length; i++) {
      var row = Game.rows[i];

      var complete = true;
      for (var j = 0; j < row.length; j++) {
        if (row[j] == 0) {
          complete = false;
        }
      }

      if (complete) {
        completeRows.push(i);
      }
    }

    for (var k = 0; k < completeRows.length; k++) {
      Game.rows.splice(completeRows[k], 1);
      Game.rows.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      Game.score += 100;
      Game.linesCleared++;

      if (Game.linesCleared % 10 == 0) {
        window.clearInterval(Game.INTERVAL_ID);
        var newFrequency = Math.abs(1000 - (80 * (Game.linesCleared / 10)));
        Game.INTERVAL_ID = window.setInterval(this.step.bind(this),
                                              newFrequency);
      }
    }
  };

  Game.prototype.checkCollision = function(x, y, piece) {
    if (!piece) {
      piece = Game.PIECE_SPRITE;
    }

    var collided = false;
    for (var i = 0; i < piece.length && !collided; i++) {
      for (var j = 0; j < piece[0].length; j++) {
        if (piece[i][j] != 0) {
          if ((i + y > Game.rows.length - 1) ||
                (j + x < 0) ||
                (j + x > Game.rows[0].length - 1) ||
              (Game.rows[i + y][x + j] != 0)) {
            collided = true;
            break;
          }
        }
      }
    }

    return collided;
  };

  Game.PIECE_SPRITE = [];
  Game.PIECE_COORDINATES = {};

  Game.prototype.movePiece = function() {
    Game.PIECE_COORDINATES.y++;
  };

  Game.FRAME_ID = -1;

  Game.prototype.repaint = function() {
    // console.log('repaint');
    Game.FRAME_ID = requestAnimationFrame(this.repaint.bind(this));

    var leftBorderX = (this.ctx.canvas.width / 2) - (10 * Game.BLOCK_SIZE / 2);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawGrid();

    for (var i = 0; i < Game.rows.length; i++) {
      var row = Game.rows[i];
      for (var j = 0; j < row.length; j++) {

        var blockCode = row[j];
        if (//blockCode == 0 &&
            i >= Game.PIECE_COORDINATES.y &&
            i <= Game.PIECE_COORDINATES.y + Game.PIECE_SPRITE.length - 1 &&
            j >= Game.PIECE_COORDINATES.x &&
            j <= Game.PIECE_COORDINATES.x + Game.PIECE_SPRITE[0].length - 1) {

          var pieceY = Math.abs(Game.PIECE_COORDINATES.y - i);
          var pieceX = Math.abs(j - Game.PIECE_COORDINATES.x);

          var pieceCode = Game.PIECE_SPRITE[pieceY][pieceX];
          if (pieceCode != 0) {
            blockCode = pieceCode;
          }
        }

        var color = this.decodeColor(blockCode);

        this.ctx.strokeStyle  = color;
        this.ctx.fillStyle  = color;
        this.ctx.fillRect(leftBorderX + 1 + (j * Game.BLOCK_SIZE),
                      10 + 1 + (i * Game.BLOCK_SIZE),
                      28,
                      28);
      }

    }

    /* Draw the next piece */
    for (var n = 0; n < Game.NEXT_PIECE.length; n++) {
      for (var p = 0; p < Game.NEXT_PIECE[0].length; p++) {

        var nextBlock = Game.NEXT_PIECE[n][p];
        if (nextBlock != 0) {
          var nextBlockColor = this.decodeColor(nextBlock);
          this.ctx.strokeStyle = this.ctx.fillStyle = nextBlockColor;
          this.ctx.fillRect(630 + (p * 30),
                            250 + (n * 30),
                            28,
                            28);
        }
      }
    }

    this.ctx.strokeStyle = 'rgb(100, 100, 100)';
    this.ctx.fillStyle = 'rgb(100, 100, 100)';
    this.ctx.font = '20px sans-serif';
    this.ctx.fillText('Score: ' + Game.score, 20, 250);
    this.ctx.fillText('Lines: ' + Game.linesCleared, 20, 320);
  };

  Game.prototype.decodeColor = function(code) {
    var cor;
    switch (code) {
      case 0:
        cor = 'white';
        break;
      case 1:
        cor = 'red';
        break;
      case 2:
        cor = 'blue';
        break;
      case 3:
        cor = 'magenta';
        break;
      case 4:
        cor = 'purple';
        break;
      case 5:
        cor = 'orange';
        break;
      case 6:
        cor = 'rgb(150, 150, 150)';
        break;
      case 7:
        cor = 'green';
        break;
      default:
        alert('invalid color: ' + blockCode);
        break;
    }

    return cor;
  };

  Game.prototype.step = function() {
    console.log('step');

    this.checkIfPieceWillCollide();
    this.movePiece();

  };

})();
