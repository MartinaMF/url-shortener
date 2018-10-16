const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
app.use(cors());
app.use(bodyParser.json());
//connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortUrls');
//allow node to find static content
app.use(express.static(__dirname + '/public'));
app.get('/new/:urlToShorten(*)', (req,res)=>{
  var {urlToShorten} = req.params;
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex=expression;
  if(regex.test(urlToShorten)===true){
    var short = Math.floor(Math.random()*100000).toString();
    var data = new shortUrl(
      {
        originalUrl : urlToShorten,
        shortUrl : short
      }
    );
    data.save(err=>{
      if(err){
        return res.send('Error saving to database');
      }
    });
    return res.json(data);
  }
  return res.json({"urlToShorten" : "faild"});
});
app.get('/:urlToForward',(req,res,next)=>{
  var shorterUrl = req.params.urlToForward;
  shortUrl.findOne({'shortUrl':shorterUrl},(err,data)=>{
    if(err) return res.send('Error reading database');
    var re = new RegExp("^(http|https)://","i");
    var strToCheck = data.originalUrl;
    if(re.test(strToCheck)){
      res.redirect(301,data.originalUrl);
    }
    else{
      res.redirect(301, 'http://' + data.originalUrl);
    }
  });
});
app.listen(process.env.PORT || 3000 ,()=>{
  console.log("every thing is working")
});
