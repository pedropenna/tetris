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
      Game.ROWS.push(row);
    }

    this.spawnNewPiece();
    Game.PIECE_COORDINATES = {x: 4, y: 0};

    this.repaint();

    Game.INTERVAL_ID = window.setInterval(this.step.bind(this), 300);
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

  Game.ROWS = [];

  Game.prototype.checkIfPieceWillCollide = function() {
    var nextY = Game.PIECE_COORDINATES.y + 1;

    var collided = this.checkCollision(Game.PIECE_COORDINATES.x,
                                       Game.PIECE_COORDINATES.y + 1);

    if (collided) {
      console.log('collided!');

      this.solidifyPiece();

      this.spawnNewPiece();
    }

    // if piece collided
    //   solidify it
    //   clear all complete lines
    //   create an equal ammount of lines on top of the grid
    //   create new piece
    //   spawn the new piece
  };

  Game.prototype.spawnNewPiece = function() {
    var randomNumber = parseInt(Math.random() * 7);
    switch (randomNumber) {
    case 0:
      Game.PIECE_SPRITE = [[1, 1],
                           [1, 1]];
      break;
    case 1:
      Game.PIECE_SPRITE = [[2, 2, 2, 2]];
      break;
    case 2:
      Game.PIECE_SPRITE = [[0, 3],
                           [3, 3],
                           [3, 0]];
      break;
    case 3:
      Game.PIECE_SPRITE = [[4, 0],
                           [4, 4],
                           [0, 4]];
      break;
    case 4:
      Game.PIECE_SPRITE = [[0, 5, 0],
                           [5, 5, 5]];
      break;
    case 5:
      Game.PIECE_SPRITE = [[6, 6],
                           [6, 0],
                           [6, 0]];
      break;
    case 6:
      Game.PIECE_SPRITE = [[7, 7],
                           [0, 7],
                           [0, 7]];
      break;
    default:
      alert('valor invalido: ' + randomNumber);
      break;
    }

    Game.PIECE_COORDINATES = {x: 4, y: -1};

  };

  Game.prototype.solidifyPiece = function() {
    for (var k = 0; k < Game.PIECE_SPRITE.length; k++) {
      for (var m = 0; m < Game.PIECE_SPRITE[0].length; m++) {
        var spriteBlockCode = Game.PIECE_SPRITE[k][m];
        if (spriteBlockCode != 0) {
          Game.ROWS[k + Game.PIECE_COORDINATES.y]
                    [Game.PIECE_COORDINATES.x + m] = spriteBlockCode;
        }
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
          if ((i + y > Game.ROWS.length - 1) ||
                (j + x < 0) ||
                (j + x > Game.ROWS[0].length - 1) ||
              (Game.ROWS[i + y][x + j] != 0)) {
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

    // console.log('Game.FRAME_ID', Game.FRAME_ID);

    var leftBorderX = (this.ctx.canvas.width / 2) - (10 * Game.BLOCK_SIZE / 2);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawGrid();

    for (var i = 0; i < Game.ROWS.length; i++) {
      var row = Game.ROWS[i];
      for (var j = 0; j < row.length; j++) {

        var blockCode = row[j];
        if (//blockCode == 0 &&
            i >= Game.PIECE_COORDINATES.y &&
            i <= Game.PIECE_COORDINATES.y + Game.PIECE_SPRITE.length - 1 &&
            j >= Game.PIECE_COORDINATES.x &&
            j <= Game.PIECE_COORDINATES.x + Game.PIECE_SPRITE[0].length - 1) {

          var pieceY = Math.abs(Game.PIECE_COORDINATES.y - i);
          var pieceX = Math.abs(j - Game.PIECE_COORDINATES.x);
          // console.log('i j', i, j);
          // console.log('piece X Y ', pieceY, pieceX);
          var pieceCode = Game.PIECE_SPRITE[pieceY][pieceX];
          if (pieceCode != 0) {
            blockCode = pieceCode;
          }
        }

        // 6, 1 -> [1][2]

        var cor;
        switch (blockCode) {
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
            cor = 'yellow';
            break;
          case 4:
            cor = 'purple';
            break;
          case 5:
            cor = 'orange';
            break;
          case 6:
            cor = 'brown';
            break;
          case 7:
            cor = 'green';
            break;
          default:
            alert('invalid color: ' + blockCode);
            break;
        }

        // this.ctx.beginPath();
        this.ctx.strokeStyle  = cor;
        this.ctx.fillStyle  = cor;
        this.ctx.fillRect(leftBorderX + 1 + (j * Game.BLOCK_SIZE),
                      10 + 1 + (i * Game.BLOCK_SIZE),
                      28,
                      28);
        // this.ctx.stroke();
      }

    }

  };

  Game.prototype.step = function() {
    console.log('step');

    this.checkIfPieceWillCollide();
    this.movePiece();

  };

})();
