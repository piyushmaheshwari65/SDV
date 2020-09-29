const express = require("express");
const path = require('path');
const app = express();
const fs = require('fs');
var multer  = require('multer');

//var upload = multer({ dest: 'uploads/' });

var ipfsAPI = require('ipfs-api');
 
// connect to ipfs daemon API server
var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now());
    }
  });
  
  var upload = multer({ storage : storage}).single('userDocument');

// Static assets
app.use(express.static(path.join(__dirname, '/')));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
  });

app.post('/api/document',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }

        var data = new Buffer(fs.readFileSync(req.file.path));
        ipfs.files.add(data,function(err,res1){
            console.log(res1); 
            res.send(res1);      
        })
    });
});
 
  app.get('/download',function(req,res){
    // myContract.methods.getWord().call({from:account})
    // .then(function(result){
    //     console.log(result);
    //     // res.send(result);
    //     res.redirect('https://ipfs.io/ipfs/'+result);
    // })
    res.redirect('https://ipfs.io/ipfs/'+req);
     
  })

  

app.listen(3001);


