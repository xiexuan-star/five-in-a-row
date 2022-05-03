<template>
  <div>
    <div>当前玩家: {{ board.currentPlayer }}</div>
    <div class="row" v-for="(row,rowIndex) in board.pieces" :key="rowIndex" flex="~ center">
      <div
        w-20
        h-20
        cursor-pointer
        flex="~ center"
        :class="[
          'col',
          {
          'is-last-col': piece.col === row.length-1,
          'is-last-row': rowIndex === board.pieces.length-1
          }
        ]"
        @click="pieceClick(piece)"
        v-for="piece in row" :key="`${piece.row}-${piece.col}`">
        <div :class="piece.isWhite?'white':piece.isBlack?'black':''"/>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>

class Board {
  isEnd = false;
  width = 0;
  height = 0;
  pieces: Piece[][] = [];

  currentPlayer = PIECES_STATE.WHITE;

  constructor(width = 20, height = 20) {
    this.width = width;
    this.height = height;
    this.init();
  }

  async play(piece: Piece) {
    if (this.isEnd) return;
    await piece.setState(this.currentPlayer);
    setTimeout(async () => {
      await this.checkWinner();
      if (this.currentPlayer === PIECES_STATE.WHITE) {
        this.currentPlayer = PIECES_STATE.BLACK;
      } else {
        this.currentPlayer = PIECES_STATE.WHITE;
      }
    });
  }

  init() {
    for (let i = 0; i < this.height - 1; i++) {
      const row = this.pieces[i] = [] as Piece[];
      for (let j = 0; j < this.width - 1; j++) {
        row.push(new Piece(i, j));
      }
    }
  }

  async checkWinner() {
    return Promise.allSettled([
      this.checkColWinner(),
      this.checkRowWinner(),
      this.checkObliqueWinner()
    ]).then(([col, row, oblique]) => {
      if (col.status === 'fulfilled') {
        alert(`winner is ${ col.value }`);
        return true;
      }
      if (row.status === 'fulfilled') {
        alert(`winner is ${ row.value }`);
        return true;
      }
      if (oblique.status === 'fulfilled') {
        alert(`winner is ${ oblique.value }`);
        return true;
      }
    }).then((hasWinner) => {
      if (hasWinner) this.stop();
    });
  }

  stop() {
    this.isEnd = true;
  }

  async checkObliqueWinner() {
    return new Promise<PIECES_STATE | undefined>((resolve, reject) => {
      reject();
    });
  }

  async checkColWinner() {
    return new Promise<PIECES_STATE | undefined>((resolve, reject) => {
      const states = Array.from({ length: this.pieces[0].length }).map(() => {
        return { state: PIECES_STATE.DEFAULT, repeat: 0 };
      });
      this.pieces.find(row => {
        row.find((piece, colIndex) => {
          const status = states[colIndex];
          if (piece.state === status.state && piece.state !== PIECES_STATE.DEFAULT) {
            status.repeat++;
          } else {
            status.state = piece.state;
            status.repeat = 1;
          }
          if (status.repeat >= 5) {
            resolve(status.state);
            return true;
          }
        });
      });
      reject();
    });
  }

  async checkRowWinner() {
    return new Promise<PIECES_STATE | undefined>((resolve, reject) => {
      this.pieces.find(row => {
        let repeat = 0;
        let current = PIECES_STATE.WHITE;
        return row.find(piece => {
          if (piece.state === current && piece.state !== PIECES_STATE.DEFAULT) {
            repeat++;
          } else {
            current = piece.state;
            repeat = 1;
          }
          if (repeat >= 5) {
            resolve(current);
            return true;
          }
        });
      });
      reject();
    });
  }
}

enum PIECES_STATE {
  DEFAULT = '默认', WHITE = '白', BLACK = '黑'
}

class Piece {
  state = PIECES_STATE.DEFAULT;

  constructor(public row: number, public col: number) {}

  async setState(state: PIECES_STATE) {
    if (this.state !== PIECES_STATE.DEFAULT) return Promise.reject('已经设置过棋子');
    this.state = state;
  }

  get isWhite() {
    return this.state === PIECES_STATE.WHITE;
  }

  get isBlack() {
    return this.state === PIECES_STATE.BLACK;
  }
}

const board = reactive(new Board(20, 20));
board.init();

function pieceClick(piece: Piece) {
  board.play(piece);
}
</script>
<style lang="scss" scoped>
.row {
  .col {
    position: relative;

    .white, .black {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 4rem;
      height: 4rem;
      z-index: 100;
      border-radius: 50%;
      box-shadow: 0.1rem .1rem .4rem rgba(0, 0, 0, .5);
    }

    .white {
      background: white;
    }

    .black {
      background: black;
    }

    &:not(.is-last-col) {
      &::before {
        content: '';
        position: absolute;
        width: 5rem;
        height: 0.2rem;
        background: black;
        left: 2.5rem;
        top: 2.5rem;
      }
    }

    &:not(.is-last-row) {
      &::after {
        content: '';
        position: absolute;
        width: 0.2rem;
        height: 5rem;
        background: black;
        left: 2.5rem;
        top: 2.5rem;
      }
    }
  }
}
</style>
