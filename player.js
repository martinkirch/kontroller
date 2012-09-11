/**
 * Class tied to a "Play" button - yep, the big squares
 * @param parent HTML element
 * @param path to the sound (the "src" attribute)
 */
function Player(parent, path) {
	this.container = $('<div>').addClass('player').text(path)
	this.player = $('<audio>').attr({src:path, preload:'auto'}).appendTo(this.container)
	
	var self = this;
	
	// PLAY/PAUSE
	this.container.click(function(e) {
		e.preventDefault();
		var audioElem = self.player[0]
		
		if (audioElem.currentTime == 0 || audioElem.ended) {
			audioElem.play();
			self.container.addClass('playing');
		} else {
			audioElem.pause();
			audioElem.currentTime = 0;
			self.player.trigger('ended');
		}
	})
	
	this.player.bind('ended', function(e) {
		self.container.removeClass('playing');	
	});
	
	this.container.appendTo($(parent))
}