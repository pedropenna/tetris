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

  Game.prototype.initGame = function() {
    console.log('init game');

    for (var i = 1; i <= 20; i++) {
      var row = [];
      for (var j = 1; j <= 10; j++) {
        row.push(0);
      }
      Game.ROWS.push(row);
    }

    // Game.PIECE_SPRITE = [[5, 0],
    //                      [5, 5],
    //                      [0, 5]];

    Game.PIECE_SPRITE = [[0, 5, 0],
                         [5, 5, 5]];

    Game.ROWS[7][3] = 1;
    Game.ROWS[7][2] = 1;
    Game.ROWS[6][3] = 1;
    Game.ROWS[6][4] = 1;
    Game.ROWS[0][2] = 2;
    Game.ROWS[2][0] = 3;
    Game.ROWS[11][6] = 4;

    this.repaint();

    window.setInterval(this.step.bind(this), 300);
  };

  Game.ROWS = [];

  Game.prototype.checkIfPieceCollided = function() {
    // if piece collided
    //   solidify it
    //   clear all complete lines
    //   create an equal ammount of lines on top of the grid
    //   create new piece
    //   spawn the new piece
  };

  Game.PIECE_SPRITE = [];
  Game.PIECE_COORDINATES = {x: 4, y: 0};

  Game.prototype.movePiece = function() {
    Game.PIECE_COORDINATES.y++;
  };

  Game.FRAME_ID = -1;

  Game.prototype.repaint = function() {
    console.log('repaint');
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
            Game.PIECE_COORDINATES.y >= i &&
            Game.PIECE_COORDINATES.y <= i + Game.PIECE_SPRITE.length - 1 &&
            Game.PIECE_COORDINATES.x >= j &&
            Game.PIECE_COORDINATES.x <= j + Game.PIECE_SPRITE[0].length - 1) {

          var pieceY = Math.abs(i - Game.PIECE_COORDINATES.y);
          var pieceX = Math.abs(j - Game.PIECE_COORDINATES.x);
          console.log('i j', i, j);
          console.log('piece X Y ', pieceY, pieceX);
          var pieceCode = Game.PIECE_SPRITE[pieceY][pieceX];
          if (pieceCode != 0) {
            blockCode = pieceCode;
          }
        }

        // 6, 1 -> [1][2]

        var cor;
        switch (blockCode) {
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
          default:
            cor = 'white';
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

    // var cor = 'rgb(' + Math.ceil(254 * Math.random()) +
    //         ',' + Math.ceil(254 * Math.random()) +
    //         ',' + Math.ceil(254 * Math.random()) + ')';
    // console.log('cor', cor);
    // this.ctx.strokeStyle  = cor;
    // this.ctx.fillStyle  = cor;
    // this.ctx.beginPath();
    // this.ctx.rect(800 * Math.random(),
    //          599 * Math.random(),
    //          70 * Math.random(),
    //          80 * Math.random());
    // this.ctx.fillRect(799 * Math.random(),
    //         599 * Math.random(),
    //         70 * Math.random(),
    //         80 * Math.random());
    // this.ctx.stroke();

  };

  Game.prototype.step = function() {
    console.log('step');

    this.checkIfPieceCollided();
    this.movePiece();

  };

})();
