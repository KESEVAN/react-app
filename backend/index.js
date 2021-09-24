const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
var multer = require('multer');
fs = require('fs');
const path = require('path');

// app.use(bodyParser.json())
const mongouri = "mongodb+srv://msritop123:msritop123@rit-dataset.ypq0r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(mongouri,
  { useNewUrlParser: true, useUnifiedTopology: true }, err => {
      console.log('connected to MongoDB')
  });

 //Image is a model which has a schema imageSchema
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
      console.log("storage....")
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now()+'.jpg')
  }
});
//refers to the models.js for Schema
var imgModel = require('./models');
//refers to storage var 
var upload = multer({ storage: storage });

// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// imgModel.find gets all the images from cluster
app.get('/', (req, res) => {
  imgModel.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('ImagesPages.ejs', { items: items });
          console.log("images",items[0],'imagemod:',imgModel)
      }
  });
});

app.post('/', upload.single('image'), (req, res, next) => {
 
  var obj = {
      name: req.body.name,
      desc: req.body.desc,
      img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
      }
  }
  imgModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          // item.save();
          console.log("Redirecting...")
          res.redirect('/');
      }
  });
});

var port = process.env.PORT || '3000'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})


