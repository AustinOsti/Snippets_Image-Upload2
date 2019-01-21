var express = require('express');
var router = express.Router();
var fs = require('fs');
var Upload = require('../models/upload');
var multer = require('multer');
var cloudinary = require('cloudinary');

var upload = multer({
	dest: 'uploads/'
}).single('file');

// Set Storage config
cloudinary.config({ 
	cloud_name: 'shimini-solutions-ltd', 
	api_key: '285862489374467', 
	api_secret: 'j7rN4bvDsEHS5DNb_hztuqbD_0o' 
}); 
 
/**
 * Gets the list of all files from the database
 */
router.get('/', function (req, res, next) {
  Upload.find({},  function (err, uploads) {
    if (err) next(err);
    else {
      res.send(uploads);
    }
  });
});

/**
 * Gets a file from the hard drive based on the unique ID and the filename
 */
router.get('/:uuid/:filename', function (req, res, next) {
  console.log(req.params);
  Upload.findOne({
    'file.filename': req.params.uuid,
    'file.originalname': req.params.filename
  }, function (err, upload) {

    if (err) next(err);
    else {
      res.set({
        "Content-Disposition": 'attachment; filename="' + upload.file.originalname + '"',
        "Content-Type": upload.file.mimetype
      });
      fs.createReadStream(upload.file.path).pipe(res);
    }
  });
});

/**
 * Create's the file in the database
 */
router.post('/', upload, function (req, res, next) {
	console.log(req.body);
	console.log(req.file);
	cloudinary.uploader.upload(req.file.path, function(image) {			
		console.log(image);		
		var newUpload = {
			name: req.body.name,
			created: Date.now(),
			file: image
		};			
		Upload.create(newUpload, function (err, next) {
			if (err) {
				next(err);
			} else {
				res.send(newUpload);
			}
		});			
	});	 
});

module.exports = router;