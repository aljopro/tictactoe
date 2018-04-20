import { Player } from './player';
import { Board } from './board';

export class BoardPosition {

	public element: HTMLElement;
	public key: number;
	public board: Board;
	public used: boolean = false;

	private _clickHandler = (event: MouseEvent) => {
		if (!this.board.winningPlayer) {
			this.board.move(this);
			this.board.switchPlayer();
		}

		this.element.removeEventListener('click', this._clickHandler);
	}

	constructor(key: number, board: Board) {
		const positionElement = document.createElement('DIV');
		positionElement.classList.add('board__position');
		positionElement.id = "board__position_" + key;
		positionElement.style.width = (1 / board.size * 100) + '%';

		this.element = positionElement;
		this.board = board;
		this.key = key;

		this.element.addEventListener('click', this._clickHandler);
	}

	public placeToken(player: Player) {
		this.element.dataset['playertoken'] = player.token;
		this.used = true;
	}

	public reset() {
		this.element.addEventListener('click', this._clickHandler);
		delete this.element.dataset['playertoken'];
		this.used = false;
	}

}
