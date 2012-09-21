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
	// Put your own DB name here
	_db : $.couch.db("kontroller"),
	
	uri : $.couch.db("kontroller").uri,
	
	get: function(id, callback) {
		Db._db.openDoc(id, {
			success:callback,
			error: function(status, error, reason) {
				console.log(status + ": " + error + " - " + reason);
			}
		});
	},
	
	/**
	 * Uploads the given file and creates a Clip for it
	 * @param File object
	 */
	addClipToSet : function(file) {
		Uploader.queue(file, function(attachmentDoc){
			Db.get(attachmentDoc._id, function(doc){ // re-get to have an authentic _attachments object
				doc.type = 'clip';
				doc.title = file.name.substr(0, file.name.lastIndexOf('.'));
				doc.loop = false;

				Db._db.saveDoc(doc, {
					success: function(data) {
						doc._rev = data.rev;
						new Clip(doc);
					},
					error: function(status, error, reason) {
						console.log(status + ": " + error + " - " + reason);
					}
				});
			});
		});
	},
	
	/**
	 * Update an existing Clip object
	 */
	updateClip : function(clip) {
		Db._db.saveDoc(clip.doc, {
			success: function(data) { clip.doc._rev = data.rev; },
			error: function(status, error, reason) { console.log(status + ": " + error + " - " + reason); }
		});
	}
}