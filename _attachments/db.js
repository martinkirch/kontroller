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
	
	onError : function(status, error, reason) {
		$('#errors').show().append("<p>"+status+": "+error+" - "+reason+"</p>");
	},
	
	get: function(id, callback) {
		Db._db.openDoc(id, {
			success:callback,
			error: Db.onError
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
				doc.modified_at = new Date().toJSON();

				Db._db.saveDoc(doc, {
					success: function(data) {
						doc._rev = data.rev;
						new Clip(doc);
					},
					error: Db.onError
				});
			});
		});
	},
	
	/**
	 * Update an existing Clip object
	 */
	updateClip : function(clip) {
		clip.doc.modified_at = new Date().toJSON();
		
		Db._db.saveDoc(clip.doc, {
			success: function(data) { clip.doc._rev = data.rev; },
			error: Db.onError
		});
	},
	
	/**
	 * Fetchs metadata about the "max" latest clips, and applies the each(doc) callback to each
	 */
	latestClips : function(max, each) {
		Db._db.view("kontroller/latest-clips", {
			include_docs: true,
			limit: max,
			descending: true,
			success: function(data) {
				for (var i=0; i < data.rows.length; i++) {
					each(data.rows[i].doc);
				};
			},
			error: Db.onError
		})
	}
}