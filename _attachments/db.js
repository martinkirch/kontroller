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
	 * Uploads the given file and creates a Clip for it
	 * @param File object
	 */
	addClipToSet : function(file) {
		Uploader.queue(file, function(doc, file) {
			doc._type = 'clip';
			doc.title = file.name;
			doc.loop = false;
			
			new Clip(doc);
		});
	}
}