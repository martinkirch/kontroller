$(document).ready(function() {
	var parent = $('#players')
	var player1 = new Player(parent, 'jingles/batterie.wav', true)
	var player2 = new Player(parent, 'jingles/coucou.wav')
});