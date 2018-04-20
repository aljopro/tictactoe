import { Board } from './board';

const board = new Board();
board.element.addEventListener('board.move', (event: CustomEvent) => {
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

function manageGame(detail: any) {
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
