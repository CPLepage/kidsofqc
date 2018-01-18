var path=require("path");
var tumblr = require('tumblr');
var shuffle = require('shuffle-array')
 
var oauth = {
  consumer_key: '',
  consumer_secret: ''
};

var blog = new tumblr.Blog('kidsofqc.tumblr.com', oauth);



module.exports = function (app) {

    app.get('/api/photos', function (req, res) {
        var photos = [];
        blog.info(function(error, response){
            var nbPhotos = 20;
            for(var i = 0; i < 1; i++){
                blog.photo({offset: i * 20, limit : 20}, function(error, response) {
                      if (error) {
                            throw new Error(error);
                      }
                      photos = photos.concat(response.posts);
                    if(photos.length == nbPhotos){
                        res.send(photos);
                    }
                });
            }
        });
    });
    
    app.get('/api/photos/:from/:to', function (req, res) {
        blog.posts({offset : req.params.from, limit: req.params.to},function(error, response) {
              if (error) {
                    throw new Error(error);
              }
             var photos = [];
            for(i in response.posts){
                for(j in response.posts[i].photos){
                    photos.push(response.posts[i].photos[j].alt_sizes[1])
                }
            }
            
            
                res.send(shuffle(photos));
            
        });
    });
        
    
    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname + '/../public/index.html')); // load the single view file (angular will handle the page changes on the front-end)
    });
};

