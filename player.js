/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

/**
 * Class tied to a "Play" button (the big squares)
 * Instanciating a new one will create the button, the AUDIO (hidden) tag and 
 * append it in the parent element.
 * @param parent HTML element
 * @param path to the sound (the "src" attribute)
 * @param (optional) should we play it as a loop ?
 */
function Player(parent, path, loop) {
	this.container = $('<div>').addClass('player');
	this.label = $('<p>').text(path).appendTo(this.container);
	this.loop = $('<span>').addClass('btnLoop').text('⟳') // aka UTF8's CLOCKWISE GAPPED CIRCLE ARROW FTW
		.appendTo(this.container);
	this.player = $('<audio>').attr({src:path, preload:'auto'}).appendTo(this.container);
	
	var self = this;
	
	// PLAY/PAUSE
	this.container.click(function(e) {
		e.preventDefault();
		var audioElem = self.player[0];
		
		if (audioElem.currentTime == 0 || audioElem.ended) {
			audioElem.play();
			self.container.addClass('playing');
		} else {
			audioElem.pause();
			audioElem.currentTime = 0;
			self.player.trigger('ended');
		}
	})
	
	// End Of Playin' callback
	this.player.bind('ended', function(e) {
		self.container.removeClass('playing');	
	});
	
	this.looping = false;
	
	// Loop trigger
	this.loop.click(function(e) {
		e.stopPropagation();
		
		if (self.looping) {
			self.container.removeClass('looping');
			self.player.removeAttr('loop');
		} else {
			self.container.addClass('looping');
			self.player.attr('loop','loop');
		}
		
		self.looping = !self.looping;
	})
	
	if (loop)
		this.loop.click();
	
	this.container.appendTo($(parent))
}