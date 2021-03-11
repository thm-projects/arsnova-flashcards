//Tried auto-generating this grid to keep the syntax shorter,
//but ran into issues with object duplication (when one updates, all update),
//so I just stuck with this ¯\_(ツ)_/¯
const emptyGrid = [
[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}]];


const game = new Vue({
  el: "#game",

  data: () => ({
    grid: emptyGrid,
    redTurn: true, //if false, it's yellow's turn. Better to use a boolean than strings.
    gameOver: false }),


  //Prevent users from navigating away from a game accidentally
  mounted() {
    window.onbeforeunload = () => {
      if (this.areThereMoves) return "Are you sure you want to leave this game?";
      //if we return nothing here (just calling return;) then there will be no pop-up question at all
    };
  },

  methods: {
    dropPiece(e) {
      if (this.gameOver) return; //No more plays once the game is done
      const column = e.target.dataset.column;

      for (let i = this.grid.length - 1; i >= 0; i--) {
        if (!this.grid[i][column].color) {
          this.grid[i][column].color = this.currentTurnColor;
          this.refreshGrid();
          const isGameOver = this.victoryCheck();

          if (isGameOver) {
            this.gameOver = true;
          } else {
            this.switchTurn();
          }
          break;
        }
      }
    },

    handleMoveCursor(e, x) {
      const currentBtn = parseInt(e.target.dataset.column);
      if (!e.key) return; //Do nothing if we don't have an identified key press

      if (["ArrowRight", "ArrowDown"].includes(e.key)) {
        this.focusAdjacentBtn(e, currentBtn, 1);
      } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
        this.focusAdjacentBtn(e, currentBtn, -1);
      } // Do nothing if the key pressed was not an arrow key
    },

    //Move focus to next or previous button
    focusAdjacentBtn(e, currentBtn, direction) {
      e.preventDefault();
      if (!direction) return;
      const adjacentBtn = document.querySelector(
      `button[data-column="${currentBtn + direction}"]`);

      if (adjacentBtn) {
        adjacentBtn.focus();
      } else if (direction > 0) {
        document.querySelector(`button[data-column]`).focus(); //wrap to beginning if at the end
      } else {
        document.querySelector(`button[data-column="7"]`).focus(); //wrap to end if at the beginning
      }
    },

    //Helps prevent multiple "drop" cursors when hovering after a button has focus
    handleHover(e) {
      e.target.focus();
    },

    //Adds the "drop" indicator above a hovered column
    handleSlotHover(e) {
      const column = e.target.dataset.column;
      document.
      querySelector(`#button-board button[data-column="${column}"]`).
      focus();
    },

    switchTurn() {
      this.redTurn = !this.redTurn;
    },

    //Necessary to get Vue to recognize changes, because changes to an object in an array of objects won't trigger a re-render
    refreshGrid() {
      this.grid = [...this.grid];
    },

    getPieceIcon(color) {
      return color == "yellow" ? "⭐" : "🔴";
    },

    //Runs through all possible win scenarios (and some impossible) to see if the game is over
    victoryCheck() {
      let isGameOver = false;
      //Loop over every victory method (some impossible, to keep the code simple; hence the optional chaining)
      this.grid.forEach((row, rowIndex) => {
        row.forEach((column, colIndex) => {var _this$grid, _this$grid$rowIndex, _this$grid$rowIndex2, _this$grid2, _this$grid2$rowIndex, _this$grid2$rowIndex2, _this$grid3, _this$grid3$rowIndex, _this$grid3$rowIndex2, _this$grid4, _this$grid5, _this$grid5$colIndex, _this$grid6, _this$grid7, _this$grid7$colIndex, _this$grid8, _this$grid9, _this$grid9$colIndex, _this$grid10, _this$grid11, _this$grid12, _this$grid13, _this$grid14, _this$grid15, _this$grid16, _this$grid17, _this$grid18, _this$grid19, _this$grid20, _this$grid21, _this$grid22, _this$grid23, _this$grid24, _this$grid25, _this$grid26, _this$grid27;
          const slotColor = column.color;
          //If we already know the game is over, get outta there
          if (!slotColor || isGameOver) return;
          if (
          //Horizontal row
          slotColor == ((_this$grid = this.grid) === null || _this$grid === void 0 ? void 0 : (_this$grid$rowIndex = _this$grid[rowIndex]) === null || _this$grid$rowIndex === void 0 ? void 0 : (_this$grid$rowIndex2 = _this$grid$rowIndex[colIndex + 1]) === null || _this$grid$rowIndex2 === void 0 ? void 0 : _this$grid$rowIndex2.color) &&
          slotColor == ((_this$grid2 = this.grid) === null || _this$grid2 === void 0 ? void 0 : (_this$grid2$rowIndex = _this$grid2[rowIndex]) === null || _this$grid2$rowIndex === void 0 ? void 0 : (_this$grid2$rowIndex2 = _this$grid2$rowIndex[colIndex + 2]) === null || _this$grid2$rowIndex2 === void 0 ? void 0 : _this$grid2$rowIndex2.color) &&
          slotColor == ((_this$grid3 = this.grid) === null || _this$grid3 === void 0 ? void 0 : (_this$grid3$rowIndex = _this$grid3[rowIndex]) === null || _this$grid3$rowIndex === void 0 ? void 0 : (_this$grid3$rowIndex2 = _this$grid3$rowIndex[colIndex + 3]) === null || _this$grid3$rowIndex2 === void 0 ? void 0 : _this$grid3$rowIndex2.color) ||
          //Vertical column
          slotColor == ((_this$grid4 = this.grid) === null || _this$grid4 === void 0 ? void 0 : (_this$grid5 = _this$grid4[rowIndex - 1]) === null || _this$grid5 === void 0 ? void 0 : (_this$grid5$colIndex = _this$grid5[colIndex]) === null || _this$grid5$colIndex === void 0 ? void 0 : _this$grid5$colIndex.color) &&
          slotColor == ((_this$grid6 = this.grid) === null || _this$grid6 === void 0 ? void 0 : (_this$grid7 = _this$grid6[rowIndex - 2]) === null || _this$grid7 === void 0 ? void 0 : (_this$grid7$colIndex = _this$grid7[colIndex]) === null || _this$grid7$colIndex === void 0 ? void 0 : _this$grid7$colIndex.color) &&
          slotColor == ((_this$grid8 = this.grid) === null || _this$grid8 === void 0 ? void 0 : (_this$grid9 = _this$grid8[rowIndex - 3]) === null || _this$grid9 === void 0 ? void 0 : (_this$grid9$colIndex = _this$grid9[colIndex]) === null || _this$grid9$colIndex === void 0 ? void 0 : _this$grid9$colIndex.color) ||
          //Diagonal ascending
          slotColor == ((_this$grid10 = this.grid) === null || _this$grid10 === void 0 ? void 0 : (_this$grid11 = _this$grid10[rowIndex - 1]) === null || _this$grid11 === void 0 ? void 0 : (_this$grid12 = _this$grid11[colIndex + 1]) === null || _this$grid12 === void 0 ? void 0 : _this$grid12.color) &&
          slotColor == ((_this$grid13 = this.grid) === null || _this$grid13 === void 0 ? void 0 : (_this$grid14 = _this$grid13[rowIndex - 2]) === null || _this$grid14 === void 0 ? void 0 : (_this$grid15 = _this$grid14[colIndex + 2]) === null || _this$grid15 === void 0 ? void 0 : _this$grid15.color) &&
          slotColor == ((_this$grid16 = this.grid) === null || _this$grid16 === void 0 ? void 0 : (_this$grid17 = _this$grid16[rowIndex - 3]) === null || _this$grid17 === void 0 ? void 0 : (_this$grid18 = _this$grid17[colIndex + 3]) === null || _this$grid18 === void 0 ? void 0 : _this$grid18.color) ||
          //Diagonal descending
          slotColor == ((_this$grid19 = this.grid) === null || _this$grid19 === void 0 ? void 0 : (_this$grid20 = _this$grid19[rowIndex + 1]) === null || _this$grid20 === void 0 ? void 0 : (_this$grid21 = _this$grid20[colIndex + 1]) === null || _this$grid21 === void 0 ? void 0 : _this$grid21.color) &&
          slotColor == ((_this$grid22 = this.grid) === null || _this$grid22 === void 0 ? void 0 : (_this$grid23 = _this$grid22[rowIndex + 2]) === null || _this$grid23 === void 0 ? void 0 : (_this$grid24 = _this$grid23[colIndex + 2]) === null || _this$grid24 === void 0 ? void 0 : _this$grid24.color) &&
          slotColor == ((_this$grid25 = this.grid) === null || _this$grid25 === void 0 ? void 0 : (_this$grid26 = _this$grid25[rowIndex + 3]) === null || _this$grid26 === void 0 ? void 0 : (_this$grid27 = _this$grid26[colIndex + 3]) === null || _this$grid27 === void 0 ? void 0 : _this$grid27.color))
          {
            isGameOver = true;
          }
        });
      });
      return isGameOver;
    },

    startNewGame() {
      if (this.areThereMoves) {
        const areYouSure = confirm(
        "Start a new game? This one will be lost four-ever :)");

        if (!areYouSure) return;
      }
      this.grid.forEach(row => {
        row.forEach(column => {
          column.color = null;
        });
      });
      this.refreshGrid();
      this.gameOver = false;
      this.redTurn = true;
    } },


  computed: {
    currentTurnColor() {
      return this.redTurn ? "red" : "yellow";
    },

    message() {
      if (this.isADraw) {
        return `<b style="color: inherit">DRAW!</b>`;
      } else if (this.gameOver) {
        return `<b class="${this.currentTurnColor}">${this.currentTurnColor} WINS! 🎉</b>`;
      } else {
        return `<b class="${this.currentTurnColor}">${this.currentTurnColor}</b>’s turn`;
      }
    },

    //Monitor whether at least one move has been made
    areThereMoves() {
      let moves = false;
      this.grid.forEach(row => {
        row.forEach(column => {
          if (column.color) moves = true;
        });
      });
      return moves;
    },

    //Monitor whether the board is full and the game is not over
    isADraw() {
      let draw = true;
      this.grid.forEach(row => {
        row.forEach(column => {
          if (!column.color) draw = false;
        });
      });
      return draw;
    } } });