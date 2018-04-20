/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board */ "./src/board.ts");

const board = new _board__WEBPACK_IMPORTED_MODULE_0__["Board"]();
board.element.addEventListener('board.move', (event) => {
    manageGame(event.detail);
});
const currentPlayerElement = document.getElementById('current_player_message');
const drawElement = document.getElementById('draw_message');
const winnerElement = document.getElementById('winner_message');
const resetButton = document.getElementById('reset_button');
resetButton.addEventListener('click', () => {
    board.reset();
    resetButton.classList.add('hidden');
    winnerElement.classList.add('hidden');
    drawElement.classList.add('hidden');
    currentPlayerElement.classList.remove('hidden');
    currentPlayerElement.dataset['playertoken'] = board.currentPlayer.token;
});
manageGame({
    board: board,
    nextPlayer: board.currentPlayer,
    player: board.currentPlayer
});
function manageGame(detail) {
    const winningPlayer = detail.board.winningPlayer;
    const nextPlayer = detail.nextPlayer;
    const currentPlayer = detail.player;
    const board = detail.board;
    currentPlayerElement.dataset['playertoken'] = nextPlayer.token;
    if (winningPlayer) {
        winnerElement.classList.remove('hidden');
        currentPlayerElement.classList.add('hidden');
        currentPlayerElement.classList.add('hidden');
        winnerElement.dataset['playertoken'] = currentPlayer.token;
        resetButton.classList.remove('hidden');
    }
    if (board.allPositionsFilled && !winningPlayer) {
        currentPlayerElement.classList.add('hidden');
        currentPlayerElement.classList.add('hidden');
        drawElement.classList.remove('hidden');
        resetButton.classList.remove('hidden');
    }
}


/***/ }),

/***/ "./src/board-position.ts":
/*!*******************************!*\
  !*** ./src/board-position.ts ***!
  \*******************************/
/*! exports provided: BoardPosition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoardPosition", function() { return BoardPosition; });
class BoardPosition {
    constructor(key, board) {
        this.used = false;
        this._clickHandler = (event) => {
            if (!this.board.winningPlayer) {
                this.board.move(this);
                this.board.switchPlayer();
            }
            this.element.removeEventListener('click', this._clickHandler);
        };
        const positionElement = document.createElement('DIV');
        positionElement.classList.add('board__position');
        positionElement.id = "board__position_" + key;
        positionElement.style.width = (1 / board.size * 100) + '%';
        this.element = positionElement;
        this.board = board;
        this.key = key;
        this.element.addEventListener('click', this._clickHandler);
    }
    placeToken(player) {
        this.element.dataset['playertoken'] = player.token;
        this.used = true;
    }
    reset() {
        this.element.addEventListener('click', this._clickHandler);
        delete this.element.dataset['playertoken'];
        this.used = false;
    }
}


/***/ }),

/***/ "./src/board.ts":
/*!**********************!*\
  !*** ./src/board.ts ***!
  \**********************/
/*! exports provided: Board */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Board", function() { return Board; });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/player.ts");
/* harmony import */ var _board_position__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./board-position */ "./src/board-position.ts");


function initArray(length) {
    return new Array(length).fill(null);
}
class Board {
    constructor(size, players) {
        this.element = document.getElementById('board');
        this._currentPlayerIndex = 0;
        this._players = [];
        this._winConditions = null;
        this._size = size || 3;
        this._players = players || [
            new _player__WEBPACK_IMPORTED_MODULE_0__["Player"]('X'),
            new _player__WEBPACK_IMPORTED_MODULE_0__["Player"]('O')
        ];
        const wins = initArray(2 * this._size + 2);
        wins.forEach((value, positionIndex) => {
            wins[positionIndex] = initArray(this._size).map((value, index) => {
                if (positionIndex < this._size) { // Horizontal
                    return (positionIndex * this._size) + index;
                }
                else if (positionIndex < this._size * 2) { // Vertical
                    const p = (positionIndex % this._size);
                    return (index * this._size) + p;
                }
                else if (positionIndex === wins.length - 2) { // Left to Right Diaginol
                    return (index * this._size) + index;
                }
                else { // Right to Left Diaginol
                    return (index * this._size) + (this._size - 1 - index);
                }
            });
        });
        this._winConditions = wins;
        this.boardPositions = new Array(9).fill(null).map((v, index) => {
            const boardPosition = new _board_position__WEBPACK_IMPORTED_MODULE_1__["BoardPosition"](index, this);
            return boardPosition;
        });
        this.boardPositions.forEach((position) => {
            this.element.appendChild(position.element);
        });
    }
    get currentPlayer() {
        return this._players[this._currentPlayerIndex];
    }
    get players() {
        return this._players;
    }
    get size() {
        return this._size;
    }
    get winningPlayer() {
        return this._players.find(player => player.hasWon);
    }
    get nextPlayer() {
        return this._players[(this._currentPlayerIndex + 1) % this._players.length];
    }
    get allPositionsFilled() {
        return this.boardPositions.every(position => position.used);
    }
    move(position, player = this.currentPlayer) {
        player.move(position);
        player.winningMoves = this.winningMoveSet();
        const event = new CustomEvent('board.move', {
            detail: {
                player: player,
                nextPlayer: this.nextPlayer,
                board: this,
                position: position
            }
        });
        this.element.dispatchEvent(event);
    }
    switchPlayer(player = this.currentPlayer) {
        const playerIndex = this._players.findIndex(p => p.token === player.token);
        this._currentPlayerIndex = (playerIndex + 1) % this._players.length;
    }
    winningMoveSet(player) {
        const movingPlayer = player || this.currentPlayer;
        const moves = movingPlayer.moves;
        const winPositions = this._winConditions.find((winCondition) => {
            if (moves.length < this._size) {
                return false;
            }
            return winCondition.every((winMove) => {
                return moves.includes(winMove);
            });
        }) || null;
        if (winPositions) {
            winPositions.forEach((positionKey) => {
                const position = this.boardPositions.find(pos => positionKey === pos.key);
                position.element.classList.add('board__postion--win');
            });
        }
        return winPositions;
    }
    reset() {
        this._currentPlayerIndex = 0;
        this.players.forEach((player) => {
            player.reset();
        });
        this.boardPositions.forEach((position) => {
            position.reset();
        });
    }
}


/***/ }),

/***/ "./src/player.ts":
/*!***********************!*\
  !*** ./src/player.ts ***!
  \***********************/
/*! exports provided: Player */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Player", function() { return Player; });
class Player {
    constructor(token) {
        this.moves = [];
        this.winningMoves = null;
        this.token = token;
    }
    get hasWon() {
        return !!this.winningMoves;
    }
    move(position) {
        this.moves.push(position.key);
        position.placeToken(this);
    }
    reset() {
        this.winningMoves = null;
        this.moves = [];
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYm9hcmQtcG9zaXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JvYXJkLnRzIiwid2VicGFjazovLy8uL3NyYy9wbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ25FZ0M7QUFFaEMsTUFBTSxLQUFLLEdBQUcsSUFBSSw0Q0FBSyxFQUFFLENBQUM7QUFDMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFrQixFQUFFLEVBQUU7SUFDbkUsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQixDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sb0JBQW9CLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQy9FLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDNUQsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFB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QUFRLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBb0NEOzs7Ozs7Ozs7Ozs7Ozs7QUNuSUs7SUFLTCxZQUFZLEtBQWE7UUFKbEIsVUFBSyxHQUFhLEVBQUUsQ0FBQztRQUNyQixpQkFBWSxHQUFhLElBQUksQ0FBQztRQUlwQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBVyxNQUFNO1FBQ2hCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDNUIsQ0FBQztJQUVNLElBQUksQ0FBQyxRQUF1QjtRQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRU0sS0FBSztRQUNYLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLENBQUM7Q0FDRCIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2FwcC50c1wiKTtcbiIsImltcG9ydCB7IEJvYXJkIH0gZnJvbSAnLi9ib2FyZCc7XG5cbmNvbnN0IGJvYXJkID0gbmV3IEJvYXJkKCk7XG5ib2FyZC5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JvYXJkLm1vdmUnLCAoZXZlbnQ6IEN1c3RvbUV2ZW50KSA9PiB7XG5cdG1hbmFnZUdhbWUoZXZlbnQuZGV0YWlsKTtcbn0pO1xuXG5jb25zdCBjdXJyZW50UGxheWVyRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJyZW50X3BsYXllcl9tZXNzYWdlJyk7XG5jb25zdCBkcmF3RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmF3X21lc3NhZ2UnKTtcbmNvbnN0IHdpbm5lckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2lubmVyX21lc3NhZ2UnKTtcbmNvbnN0IHJlc2V0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2V0X2J1dHRvbicpO1xuXG5yZXNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0Ym9hcmQucmVzZXQoKTtcblx0cmVzZXRCdXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdHdpbm5lckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cdGRyYXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRjdXJyZW50UGxheWVyRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0Y3VycmVudFBsYXllckVsZW1lbnQuZGF0YXNldFsncGxheWVydG9rZW4nXSA9IGJvYXJkLmN1cnJlbnRQbGF5ZXIudG9rZW47XG59KTtcblxubWFuYWdlR2FtZSh7XG5cdGJvYXJkOiBib2FyZCxcblx0bmV4dFBsYXllcjogYm9hcmQuY3VycmVudFBsYXllcixcblx0cGxheWVyOiBib2FyZC5jdXJyZW50UGxheWVyXG59KTtcblxuZnVuY3Rpb24gbWFuYWdlR2FtZShkZXRhaWw6IGFueSkge1xuXHRjb25zdCB3aW5uaW5nUGxheWVyID0gZGV0YWlsLmJvYXJkLndpbm5pbmdQbGF5ZXI7XG5cdGNvbnN0IG5leHRQbGF5ZXIgPSBkZXRhaWwubmV4dFBsYXllcjtcblx0Y29uc3QgY3VycmVudFBsYXllciA9IGRldGFpbC5wbGF5ZXI7XG5cdGNvbnN0IGJvYXJkID0gZGV0YWlsLmJvYXJkO1xuXG5cdGN1cnJlbnRQbGF5ZXJFbGVtZW50LmRhdGFzZXRbJ3BsYXllcnRva2VuJ10gPSBuZXh0UGxheWVyLnRva2VuO1xuXG5cdGlmICh3aW5uaW5nUGxheWVyKSB7XG5cdFx0d2lubmVyRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblx0XHRjdXJyZW50UGxheWVyRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRjdXJyZW50UGxheWVyRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHR3aW5uZXJFbGVtZW50LmRhdGFzZXRbJ3BsYXllcnRva2VuJ10gPSBjdXJyZW50UGxheWVyLnRva2VuO1xuXHRcdHJlc2V0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHR9XG5cblx0aWYgKGJvYXJkLmFsbFBvc2l0aW9uc0ZpbGxlZCAmJiAhd2lubmluZ1BsYXllcikge1xuXHRcdGN1cnJlbnRQbGF5ZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdGN1cnJlbnRQbGF5ZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuXHRcdGRyYXdFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdHJlc2V0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQgeyBCb2FyZCB9IGZyb20gJy4vYm9hcmQnO1xuXG5leHBvcnQgY2xhc3MgQm9hcmRQb3NpdGlvbiB7XG5cblx0cHVibGljIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXHRwdWJsaWMga2V5OiBudW1iZXI7XG5cdHB1YmxpYyBib2FyZDogQm9hcmQ7XG5cdHB1YmxpYyB1c2VkOiBib29sZWFuID0gZmFsc2U7XG5cblx0cHJpdmF0ZSBfY2xpY2tIYW5kbGVyID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKCF0aGlzLmJvYXJkLndpbm5pbmdQbGF5ZXIpIHtcblx0XHRcdHRoaXMuYm9hcmQubW92ZSh0aGlzKTtcblx0XHRcdHRoaXMuYm9hcmQuc3dpdGNoUGxheWVyKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY2xpY2tIYW5kbGVyKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKGtleTogbnVtYmVyLCBib2FyZDogQm9hcmQpIHtcblx0XHRjb25zdCBwb3NpdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcblx0XHRwb3NpdGlvbkVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYm9hcmRfX3Bvc2l0aW9uJyk7XG5cdFx0cG9zaXRpb25FbGVtZW50LmlkID0gXCJib2FyZF9fcG9zaXRpb25fXCIgKyBrZXk7XG5cdFx0cG9zaXRpb25FbGVtZW50LnN0eWxlLndpZHRoID0gKDEgLyBib2FyZC5zaXplICogMTAwKSArICclJztcblxuXHRcdHRoaXMuZWxlbWVudCA9IHBvc2l0aW9uRWxlbWVudDtcblx0XHR0aGlzLmJvYXJkID0gYm9hcmQ7XG5cdFx0dGhpcy5rZXkgPSBrZXk7XG5cblx0XHR0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9jbGlja0hhbmRsZXIpO1xuXHR9XG5cblx0cHVibGljIHBsYWNlVG9rZW4ocGxheWVyOiBQbGF5ZXIpIHtcblx0XHR0aGlzLmVsZW1lbnQuZGF0YXNldFsncGxheWVydG9rZW4nXSA9IHBsYXllci50b2tlbjtcblx0XHR0aGlzLnVzZWQgPSB0cnVlO1xuXHR9XG5cblx0cHVibGljIHJlc2V0KCkge1xuXHRcdHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2NsaWNrSGFuZGxlcik7XG5cdFx0ZGVsZXRlIHRoaXMuZWxlbWVudC5kYXRhc2V0WydwbGF5ZXJ0b2tlbiddO1xuXHRcdHRoaXMudXNlZCA9IGZhbHNlO1xuXHR9XG5cbn1cbiIsImltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vcGxheWVyJztcbmltcG9ydCB7IEJvYXJkUG9zaXRpb24gfSBmcm9tICcuL2JvYXJkLXBvc2l0aW9uJztcblxuXG5mdW5jdGlvbiBpbml0QXJyYXkobGVuZ3RoOiBudW1iZXIpIHtcblx0cmV0dXJuIG5ldyBBcnJheShsZW5ndGgpLmZpbGwobnVsbCk7XG59XG5cbmV4cG9ydCBjbGFzcyBCb2FyZCB7XG5cdHB1YmxpYyBlbGVtZW50OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib2FyZCcpO1xuXG5cdHB1YmxpYyBnZXQgY3VycmVudFBsYXllcigpOiBQbGF5ZXIge1xuXHRcdHJldHVybiB0aGlzLl9wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJJbmRleF07XG5cdH1cblxuXHRwdWJsaWMgZ2V0IHBsYXllcnMoKTogUGxheWVyW10ge1xuXHRcdHJldHVybiB0aGlzLl9wbGF5ZXJzO1xuXHR9XG5cblx0cHVibGljIGdldCBzaXplKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuX3NpemU7XG5cdH1cblxuXHRwdWJsaWMgZ2V0IHdpbm5pbmdQbGF5ZXIoKTogUGxheWVyIHtcblx0XHRyZXR1cm4gdGhpcy5fcGxheWVycy5maW5kKHBsYXllciA9PiBwbGF5ZXIuaGFzV29uKTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgbmV4dFBsYXllcigpOiBQbGF5ZXIge1xuXHRcdHJldHVybiB0aGlzLl9wbGF5ZXJzWyh0aGlzLl9jdXJyZW50UGxheWVySW5kZXggKyAxKSAlIHRoaXMuX3BsYXllcnMubGVuZ3RoXTtcblx0fVxuXG5cdHB1YmxpYyBnZXQgYWxsUG9zaXRpb25zRmlsbGVkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLmJvYXJkUG9zaXRpb25zLmV2ZXJ5KHBvc2l0aW9uID0+IHBvc2l0aW9uLnVzZWQpO1xuXHR9XG5cblx0cHJpdmF0ZSBfY3VycmVudFBsYXllckluZGV4ID0gMDtcblx0cHJpdmF0ZSBfcGxheWVyczogUGxheWVyW10gPSBbXTtcblx0cHJpdmF0ZSBfc2l6ZTogbnVtYmVyO1xuXHRwcml2YXRlIF93aW5Db25kaXRpb25zOiBudW1iZXJbXVtdID0gbnVsbDtcblxuXHRwdWJsaWMgYm9hcmRQb3NpdGlvbnM6IEJvYXJkUG9zaXRpb25bXTtcblxuXHRwdWJsaWMgbW92ZShwb3NpdGlvbjogQm9hcmRQb3NpdGlvbiwgcGxheWVyOiBQbGF5ZXIgPSB0aGlzLmN1cnJlbnRQbGF5ZXIpIHtcblx0XHRwbGF5ZXIubW92ZShwb3NpdGlvbik7XG5cdFx0cGxheWVyLndpbm5pbmdNb3ZlcyA9IHRoaXMud2lubmluZ01vdmVTZXQoKTtcblxuXHRcdGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdib2FyZC5tb3ZlJywge1xuXHRcdFx0ZGV0YWlsOiB7XG5cdFx0XHRcdHBsYXllcjogcGxheWVyLFxuXHRcdFx0XHRuZXh0UGxheWVyOiB0aGlzLm5leHRQbGF5ZXIsXG5cdFx0XHRcdGJvYXJkOiB0aGlzLFxuXHRcdFx0XHRwb3NpdGlvbjogcG9zaXRpb25cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0fVxuXG5cdHB1YmxpYyBzd2l0Y2hQbGF5ZXIocGxheWVyOiBQbGF5ZXIgPSB0aGlzLmN1cnJlbnRQbGF5ZXIpIHtcblx0XHRjb25zdCBwbGF5ZXJJbmRleCA9IHRoaXMuX3BsYXllcnMuZmluZEluZGV4KHAgPT4gcC50b2tlbiA9PT0gcGxheWVyLnRva2VuKTtcblx0XHR0aGlzLl9jdXJyZW50UGxheWVySW5kZXggPSAocGxheWVySW5kZXggKyAxKSAlIHRoaXMuX3BsYXllcnMubGVuZ3RoO1xuXHR9XG5cblx0cHVibGljIHdpbm5pbmdNb3ZlU2V0KHBsYXllcj86IFBsYXllcik6IG51bWJlcltdIHtcblx0XHRjb25zdCBtb3ZpbmdQbGF5ZXIgPSBwbGF5ZXIgfHwgdGhpcy5jdXJyZW50UGxheWVyO1xuXHRcdGNvbnN0IG1vdmVzID0gbW92aW5nUGxheWVyLm1vdmVzO1xuXG5cdFx0Y29uc3Qgd2luUG9zaXRpb25zID0gdGhpcy5fd2luQ29uZGl0aW9ucy5maW5kKCh3aW5Db25kaXRpb246IG51bWJlcltdKSA9PiB7XG5cdFx0XHRpZiAobW92ZXMubGVuZ3RoIDwgdGhpcy5fc2l6ZSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB3aW5Db25kaXRpb24uZXZlcnkoKHdpbk1vdmUpID0+IHtcblx0XHRcdFx0cmV0dXJuIG1vdmVzLmluY2x1ZGVzKHdpbk1vdmUpO1xuXHRcdFx0fSk7XG5cdFx0fSkgfHwgbnVsbDtcblxuXHRcdGlmICh3aW5Qb3NpdGlvbnMpIHtcblx0XHRcdHdpblBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbktleSkgPT4ge1xuXHRcdFx0XHRjb25zdCBwb3NpdGlvbiA9IHRoaXMuYm9hcmRQb3NpdGlvbnMuZmluZChwb3MgPT4gcG9zaXRpb25LZXkgPT09IHBvcy5rZXkpO1xuXHRcdFx0XHRwb3NpdGlvbi5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2JvYXJkX19wb3N0aW9uLS13aW4nKTtcblx0XHRcdH0pO1xuXG5cblx0XHR9XG5cblx0XHRyZXR1cm4gd2luUG9zaXRpb25zO1xuXHR9XG5cblx0cHVibGljIHJlc2V0KCkge1xuXHRcdHRoaXMuX2N1cnJlbnRQbGF5ZXJJbmRleCA9IDA7XG5cdFx0dGhpcy5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuXHRcdFx0cGxheWVyLnJlc2V0KCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmJvYXJkUG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG5cdFx0XHRwb3NpdGlvbi5yZXNldCgpO1xuXHRcdH0pO1xuXHR9XG5cblx0Y29uc3RydWN0b3Ioc2l6ZT86IG51bWJlciwgcGxheWVycz86IFBsYXllcltdKSB7XG5cdFx0dGhpcy5fc2l6ZSA9IHNpemUgfHwgMztcblx0XHR0aGlzLl9wbGF5ZXJzID0gcGxheWVycyB8fCBbXG5cdFx0XHRuZXcgUGxheWVyKCdYJyksXG5cdFx0XHRuZXcgUGxheWVyKCdPJylcblx0XHRdO1xuXG5cdFx0Y29uc3Qgd2lucyA9IGluaXRBcnJheSgyICogdGhpcy5fc2l6ZSArIDIpO1xuXHRcdHdpbnMuZm9yRWFjaCgodmFsdWUsIHBvc2l0aW9uSW5kZXgpID0+IHtcblx0XHRcdHdpbnNbcG9zaXRpb25JbmRleF0gPSBpbml0QXJyYXkodGhpcy5fc2l6ZSkubWFwKCh2YWx1ZSwgaW5kZXgpID0+IHtcblx0XHRcdFx0aWYgKHBvc2l0aW9uSW5kZXggPCB0aGlzLl9zaXplKSB7IC8vIEhvcml6b250YWxcblx0XHRcdFx0XHRyZXR1cm4gKHBvc2l0aW9uSW5kZXggKiB0aGlzLl9zaXplKSArIGluZGV4O1xuXHRcdFx0XHR9IGVsc2UgaWYgKHBvc2l0aW9uSW5kZXggPCB0aGlzLl9zaXplICogMikgeyAvLyBWZXJ0aWNhbFxuXHRcdFx0XHRcdGNvbnN0IHAgPSAocG9zaXRpb25JbmRleCAlIHRoaXMuX3NpemUpO1xuXHRcdFx0XHRcdHJldHVybiAoaW5kZXggKiB0aGlzLl9zaXplKSArIHA7XG5cdFx0XHRcdH0gZWxzZSBpZiAocG9zaXRpb25JbmRleCA9PT0gd2lucy5sZW5ndGggLSAyKSB7IC8vIExlZnQgdG8gUmlnaHQgRGlhZ2lub2xcblx0XHRcdFx0XHRyZXR1cm4gKGluZGV4ICogdGhpcy5fc2l6ZSkgKyBpbmRleDtcblx0XHRcdFx0fSBlbHNlIHsgLy8gUmlnaHQgdG8gTGVmdCBEaWFnaW5vbFxuXHRcdFx0XHRcdHJldHVybiAoaW5kZXggKiB0aGlzLl9zaXplKSArICh0aGlzLl9zaXplIC0gMSAtIGluZGV4KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLl93aW5Db25kaXRpb25zID0gd2lucztcblxuXHRcdHRoaXMuYm9hcmRQb3NpdGlvbnMgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKS5tYXAoKHYsIGluZGV4KSA9PiB7XG5cdFx0XHRjb25zdCBib2FyZFBvc2l0aW9uID0gbmV3IEJvYXJkUG9zaXRpb24oaW5kZXgsIHRoaXMpO1xuXHRcdFx0cmV0dXJuIGJvYXJkUG9zaXRpb247XG5cdFx0fSk7XG5cblx0XHR0aGlzLmJvYXJkUG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG5cdFx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQocG9zaXRpb24uZWxlbWVudCk7XG5cdFx0fSk7XG5cdH1cbn1cbiIsImltcG9ydCB7IEJvYXJkUG9zaXRpb24gfSBmcm9tICcuL2JvYXJkLXBvc2l0aW9uJztcbmltcG9ydCB7IEJvYXJkIH0gZnJvbSAnLi9ib2FyZCc7XG5cbmV4cG9ydCBjbGFzcyBQbGF5ZXIge1xuXHRwdWJsaWMgbW92ZXM6IG51bWJlcltdID0gW107XG5cdHB1YmxpYyB3aW5uaW5nTW92ZXM6IG51bWJlcltdID0gbnVsbDtcblx0cHVibGljIHRva2VuOiBzdHJpbmc7XG5cblx0Y29uc3RydWN0b3IodG9rZW46IHN0cmluZykge1xuXHRcdHRoaXMudG9rZW4gPSB0b2tlbjtcblx0fVxuXG5cdHB1YmxpYyBnZXQgaGFzV29uKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAhIXRoaXMud2lubmluZ01vdmVzO1xuXHR9XG5cblx0cHVibGljIG1vdmUocG9zaXRpb246IEJvYXJkUG9zaXRpb24pIHtcblx0XHR0aGlzLm1vdmVzLnB1c2gocG9zaXRpb24ua2V5KTtcblx0XHRwb3NpdGlvbi5wbGFjZVRva2VuKHRoaXMpO1xuXHR9XG5cblx0cHVibGljIHJlc2V0KCkge1xuXHRcdHRoaXMud2lubmluZ01vdmVzID0gbnVsbDtcblx0XHR0aGlzLm1vdmVzID0gW107XG5cdH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=