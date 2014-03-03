var util = require('util');
var geo = require('geojson-utils');
var twitter = require('twitter');

var twit = new twitter({
    consumer_key: 'fiOe8DNdOE4AbriGXWsong',
    consumer_secret: 'U2tl45ya1ItkDFeXgFtU4dTAEDtmLEbDo0K2XJD0op8',
    access_token_key: '68448337-0LWfq5zMOFhRpYuaGZh1k0RIuUkcALVSOXYP1OL9u',
    access_token_secret: 'k1ZQRQcGy2AYpWUAqTl8qiYSXCXNKhXfkntoipMHfZvCk'
});

// KEYWORD
/*
twit.stream('statuses/filter', {track: "NY, New York"}, function(stream) {
  stream.on('data', function(data) {
    if(data.text === undefined || data.user === undefined || data.user.screen_name === undefined) {
      return;
    }
    
    //var loc = [6.5560, 46.5015, 6.6614, 46.5548] // Lausanne
    var loc = [-74,40,-73,41] // NY
    isInBounds(loc, data)
    
    var tweet = data.text
    var username = data.user.screen_name
    
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
    
    if (!isInBounds(loc, data)) {
      return;
    }
    
    var tweet = data.text
    var username = data.user.screen_name
    
    console.log("@"+username+":", tweet)
  });
  
  stream.on('error', function (err) {
    console.error("ERR: "+err)
  });
});

function isInBounds(loc, data) {
  if (data.coordinates) {
    return !!geo.pointInPolygon(data.coordinates, boundingBoxToPolygon(loc))
  }
  else if(data.geo && data.geo.coordinates) {
    var tmp = data.geo.coordinates[0]
    data.geo.coordinates[0] = data.geo.coordinates[1]
    data.geo.coordinates[1] = tmp
    
    return !!geo.pointInPolygon(data.geo, boundingBoxToPolygon(loc).coordinates)
  }
  else if(data.place && data.place.bounding_box) {
    var box = polygonToBoundingBox(data.place.bounding_box)
    
    return (boxIsSmall(box) && isOverlapping(loc, box))
  }
  
  return false
}

function boundingBoxToPolygon(box) {
  var a1 = Math.min(box[0], box[2])
  var a2 = Math.min(box[1], box[3])
  var b1 = Math.max(box[0], box[2])
  var b2 = Math.max(box[1], box[3])
  
  return { type: 'Polygon', coordinates: [[[a1, a2], [b1, a2], [b1, b2], [a1, b2]]] }
}

function polygonToBoundingBox(polygon) {
  if(polygon.coordinates) {
    var coords = polygon.coordinates
    var x1 = Math.min(coords[0][0][0], coords[0][1][0], coords[0][2][0], coords[0][3][0])
    var x2 = Math.max(coords[0][0][0], coords[0][1][0], coords[0][2][0], coords[0][3][0])
    var y1 = Math.min(coords[0][0][1], coords[0][1][1], coords[0][2][1], coords[0][3][1])
    var y2 = Math.max(coords[0][0][1], coords[0][1][1], coords[0][2][1], coords[0][3][1])
    
    return [x1, y1, x2, y2]
  }
}

function isOverlapping(box1, box2) {
  return (box1[0] <= box2[2] && box1[2] >= box2[0] &&
     box1[1] <= box2[3] && box1[3] >= box2[1])
}

function boxIsSmall(box) {
  var limit = 0.2
  return (Math.abs(box[2]-box[0]) < limit && Math.abs(box[3]-box[1]) < limit)
}