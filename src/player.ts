import { BoardPosition } from './board-position';
import { Board } from './board';

export class Player {
	public moves: number[] = [];
	public winningMoves: number[] = null;
	public token: string;

	constructor(token: string) {
		this.token = token;
	}

	public get hasWon(): boolean {
		return !!this.winningMoves;
	}

	public move(position: BoardPosition) {
		this.moves.push(position.key);
		position.placeToken(this);
	}

	public reset() {
		this.winningMoves = null;
		this.moves = [];
	}
}
