import { Player } from './player';
import { BoardPosition } from './board-position';


function initArray(length: number) {
	return new Array(length).fill(null);
}

export class Board {
	public element: HTMLElement = document.getElementById('board');

	public get currentPlayer(): Player {
		return this._players[this._currentPlayerIndex];
	}

	public get players(): Player[] {
		return this._players;
	}

	public get size(): number {
		return this._size;
	}

	public get winningPlayer(): Player {
		return this._players.find(player => player.hasWon);
	}

	public get nextPlayer(): Player {
		return this._players[(this._currentPlayerIndex + 1) % this._players.length];
	}

	public get allPositionsFilled(): boolean {
		return this.boardPositions.every(position => position.used);
	}

	private _currentPlayerIndex = 0;
	private _players: Player[] = [];
	private _size: number;
	private _winConditions: number[][] = null;

	public boardPositions: BoardPosition[];

	public move(position: BoardPosition, player: Player = this.currentPlayer) {
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

	public switchPlayer(player: Player = this.currentPlayer) {
		const playerIndex = this._players.findIndex(p => p.token === player.token);
		this._currentPlayerIndex = (playerIndex + 1) % this._players.length;
	}

	public winningMoveSet(player?: Player): number[] {
		const movingPlayer = player || this.currentPlayer;
		const moves = movingPlayer.moves;

		const winPositions = this._winConditions.find((winCondition: number[]) => {
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

	public reset() {
		this._currentPlayerIndex = 0;
		this.players.forEach((player) => {
			player.reset();
		});

		this.boardPositions.forEach((position) => {
			position.reset();
		});
	}

	constructor(size?: number, players?: Player[]) {
		this._size = size || 3;
		this._players = players || [
			new Player('X'),
			new Player('O')
		];

		const wins = initArray(2 * this._size + 2);
		wins.forEach((value, positionIndex) => {
			wins[positionIndex] = initArray(this._size).map((value, index) => {
				if (positionIndex < this._size) { // Horizontal
					return (positionIndex * this._size) + index;
				} else if (positionIndex < this._size * 2) { // Vertical
					const p = (positionIndex % this._size);
					return (index * this._size) + p;
				} else if (positionIndex === wins.length - 2) { // Left to Right Diaginol
					return (index * this._size) + index;
				} else { // Right to Left Diaginol
					return (index * this._size) + (this._size - 1 - index);
				}
			});
		});

		this._winConditions = wins;

		this.boardPositions = new Array(9).fill(null).map((v, index) => {
			const boardPosition = new BoardPosition(index, this);
			return boardPosition;
		});

		this.boardPositions.forEach((position) => {
			this.element.appendChild(position.element);
		});
	}
}
