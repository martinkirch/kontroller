/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

/**
 * This wraps all CouchDB operations
 */
var Db = {
	/**
	 * Uploads the given file and creates a Player of our new clip
	 * @param File object
	 */
	addClipToSet : function(file) {		
		var id = $.couch.newUUID();
		var uri = $.db.uri + id + '/' + file.name
		
		var reader = new FileReader();
		
		reader.onloadend = function (loadedEvent) {
			if (loadedEvent.target.readyState == FileReader.DONE) {
				
				$.ajax({
					url: uri,
					type: 'PUT',
					data: loadedEvent.target.result,
					processData: false,
					contentType: file.type,
					success: function(data) {
						new Player(uri);
					},
					error: function(xhr, status, error) {
						// TODO
					}
				});
				
			}
		}
		
		reader.readAsArrayBuffer(file);
	}
}