/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

/**
 * This object manages an upload queue. This avoids the instanciation of a 
 * FileReader at each upload (and hopefully saves some memory)
 */
var Uploader = {
	_reader: new FileReader(),
	_fileQueue: [],
	_callbackQueue: [],
	_uploading: false,
	
	/**
	 * @param a File object to uplaoded
	 * @param a success callback function(created_doc, file)
	 */
	queue: function(file, success) {
		Uploader._fileQueue.push(file);
		Uploader._callbackQueue.push(success);
		
		Uploader._next();
	},
	
	_next: function() {
		if (!Uploader._uploading && Uploader._fileQueue.length > 0) {
			Uploader._uploading = true;
			Uploader._reader.readAsArrayBuffer(Uploader._fileQueue[0]);
		}
	},
	
	_onLoadEnd: function(loadedEvent) {
		if (loadedEvent.target.readyState == FileReader.DONE) {
			var file = Uploader._fileQueue[0];
			var id = $.couch.newUUID();
			var uri = $.db.uri + id + '/' + file.name;
			
			$.ajax({
				url: uri,
				type: 'PUT',
				data: loadedEvent.target.result,
				processData: false,
				contentType: file.type,
				success: Uploader._onUploaded
				/*error: function(xhr, status, error) {
					TODO
				}*/
			});
		}
	},

	_onUploaded: function(response) {
		var data = $.parseJSON(response);
		var doc = {
			_id: data.id,
			_rev: data.rev,
		}
		
		Uploader._callbackQueue[0](doc, Uploader._fileQueue[0]);
		
		Uploader._fileQueue.shift();
		Uploader._callbackQueue.shift();
		Uploader._uploading = false;
		Uploader._next();
	}
};

Uploader._reader.onloadend = Uploader._onLoadEnd;