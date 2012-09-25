/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

/**
 * Wrap TWO <AUDIO> players for loops playback
 * Manual looping allow seamless loops - inspired by Géza Szekeres' method (http://onoffline.hu/html5loop/), with additional tricks !
 * @param the src attribute
 * @param its enclosing jQuery element
 */
function LoopPlayer (src, container) {
	var playing = false;
	var timeout = false;
	
	var elems = Array();
	elems[0] = $('<audio>').attr({src:src, preload:'auto'}).get()[0];
	elems[0].volume = 0;
	elems[1] = $('<audio>').attr({src:src, preload:'auto'}).get()[0];
	elems[1].volume = 0;
	
	$(elems).appendTo(container);
	
	$(elems[0]).one('play', function(e) {
		this.pause();
		
		$(elems[1]).one('play', function(e) {
			this.pause();
			
			// Now that the first (silent) playback is over, this will set up the loop once we start playing elem[0]
			$(elems).on('play', function(e) {
				playing = (playing+1) % 2;
				timeout = setTimeout(function(){elems[playing].play()}, this.duration * 1000);
				elems[playing].pause();
				elems[playing].currentTime = 0;
				
				e.preventDefault();
				e.stopPropagation();
			});
			
			elems[0].volume = 1;
			elems[1].volume = 1;
		});
		
		elems[1].play();
	});
	
	elems[0].play();
	
	this.play = function() {
		elems[0].currentTime = 0;
		elems[1].currentTime = 0;
		elems[0].play();
		playing = 0;
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