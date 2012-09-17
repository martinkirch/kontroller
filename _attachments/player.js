/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

/**
 * Wrap an <AUDIO> player for one-shot playback
 * @param the src attribute
 * @param its enclosing jQuery element
 */
function Player (src, container) {
	var elem = $('<audio>')
		.attr({src:src, preload:'auto'})
		.appendTo(container)
		.bind('ended', function() { container.trigger('ended'); })
		[0]; // so "elem" is only the created DOM element
	
	this.remove = function() {
		$(elem).remove();
		container.trigger('ended');
	}
	
	this.play = function() {
		elem.play();
	}
	
	this.stop = function() {
		elem.pause();
		elem.currentTime = 0;
	}
};