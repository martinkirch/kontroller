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
	var elems = $('<audio>').attr({src:src, preload:'auto'})
		.add(   $('<audio>').attr({src:src, preload:'auto'}))
		.appendTo(container);
	
	var playing = false;
	var timeout = false;
	
	// MANUAL LOOP FTW
	// Because using the "loop" tag in a single element inserts a short delay between loops....
	
	// wait for both elems to be created, then play a first time silently (coz first play always has a delay)
	setTimeout(function() {
		elems[1].volume = 0;
		elems[1].play();
		elems[0].volume = 0;
		elems[0].play();
		elems[1].currentTime = 0;
		elems[1].pause();
		elems[1].volume = 1;
		elems[0].currentTime = 0;
		elems[0].pause();
		elems[0].volume = 1;
		
		// wait again (while previous "play" events are triggered), then bind the manual loop
		setTimeout(function() {
			elems.bind('play', function(e) {
				playing = (playing+1) % 2;
				timeout = setTimeout(function(){elems[playing].play()}, this.duration * 1000);
				elems[playing].currentTime = 0;
				elems[playing].pause();
			});
		}, 50);
	}, 50);
	
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