var util = require('util'),
    twitter = require('twitter');
var twit = new twitter({
    consumer_key: 'fiOe8DNdOE4AbriGXWsong',
    consumer_secret: 'U2tl45ya1ItkDFeXgFtU4dTAEDtmLEbDo0K2XJD0op8',
    access_token_key: '68448337-0LWfq5zMOFhRpYuaGZh1k0RIuUkcALVSOXYP1OL9u',
    access_token_secret: 'k1ZQRQcGy2AYpWUAqTl8qiYSXCXNKhXfkntoipMHfZvCk'
});

/*
// KEYWORD
twit.stream('statuses/filter', {track: "hack"}, function(stream) {
  stream.on('data', function(data) {
    if(data.text === undefined || data.user === undefined || data.user.screen_name === undefined) {
      return;
    }
    
    var tweet = data.text
    var username = data.user.screen_name
    
    //console.log(util.inspect(data));
    console.log("@"+username)
    console.log(tweet)
    console.log("--------")
  });
});
*/

// GEOLOC
var loc = [6.5560, 46.5015, 6.6614, 46.5548] // Lausanne
twit.stream('statuses/filter', {locations: loc.join(',')}, function (stream) {
  stream.on('data', function (data) {
    if(data.text === undefined || data.user === undefined || data.user.screen_name === undefined) {
      return;
    }
    
    if(!data.coordinates || data.coordinates === undefined ||
    data.coordinates.coordinates === undefined || !isInBounds(data.coordinates.coordinates, loc)) {
      return;
    }
    
    var tweet = data.text
    var username = data.user.screen_name
    
    console.log("@"+username+":", tweet)
  });
  
  stream.on('error', function (err) {
    console.log("ERR: "+err)
  });
});

function isInBounds(tweetCoords, loc) {
  var a1 = tweetCoords[0];
  var a2 = tweetCoords[1];
  var b1 = loc[0];
  var b2 = loc[1];
  var B1 = loc[2];
  var B2 = loc[3];
  
  return (b1 <= a1 && a1 <= B1 && b2 <= a2 && a2 <= B2);
}