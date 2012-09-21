/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

/**
 * Wrap TWO <AUDIO> players for loops playback
 * Manual looping allow seamless loops - inspired by Géza Szekeres' method (http://onoffline.hu/html5loop/), with an additional trick !
 * @param the src attribute
 * @param its enclosing jQuery element
 */
function LoopPlayer (src, container) {
	var playing = false;
	var timeout = false;
	
	/**
	 * The "loop" attribute insert a short delay between loops during playback.
	 * So we loop manually with a timer
	 * On load they will play a first time silently, because the first playback has a delay too
	 */
	function createAudio(src) {
		var elem = $('<audio>')
			.attr({src:src, preload:'auto', autoplay:'true'})
			.one('play', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				this.pause();
				this.currentTime = 0;
				this.volume = 1;
				
				// Now that the first (silent) playback is over, this will set up the loop once we start playing elem[0]
				$(this).on('play', function(e) {
					playing = (playing+1) % 2;
					timeout = setTimeout(function(){elems[playing].play()}, this.duration * 1000);
					elems[playing].currentTime = 0;
					elems[playing].pause();
				});
			})
			.get()[0];
		
		elem.volume = 0;
		return elem;
	}
	
	var elems = Array(createAudio(src), createAudio(src));
	$(elems).appendTo(container);
	
	this.play = function() {
		elems[0].play();
	}
	
	this.stop = function() {
		elems[0].currentTime = 0;
		elems[0].pause();
		elems[1].currentTime = 0;
		elems[1].pause();
		clearTimeout(timeout);
		playing = false;
		timeout = false;
	}

	this.remove = function() {
		$(elems).remove();
		container.trigger('ended');
	}
};