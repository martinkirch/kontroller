/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

/**
 * Wrap TWO <AUDIO> players for looping playback
 * The two-players trick allow seamless loops - inspired from Daniel Gagan's "HTML5 Audio Loops" 2010 article
 * @param the src attribute
 * @param its enclosing jQuery element
 */
function LoopPlayer (src, container) {
	var elems = $('<audio>').attr({src:src, preload:'auto'})
		.add(   $('<audio>').attr({src:src, preload:'auto'}))
		.appendTo(container);
	
	var playing = false;
	
	this.remove = function() {
		$(elems).remove();
		container.trigger('ended');
	}
	
	this.play = function() {
		elems[0].play();
		playing = 0;
	}
	
	this.stop = function() {
		elems[playing].pause();
		elems[playing].currentTime = 0;
		playing = false;
	}
	
	// MANUAL LOOP FTW
	// Because using the "loop" tag in a single element inserts a short delay between loops....
	elems.bind('ended', function(e) {
		var old = playing;
		playing = (playing+1) % 2;
		elems[playing].play();
		elems[old].pause();
		elems[old].currentTime = 0;
	});
};