#!/usr/bin/env node
"use strict";

// Node Modules
var util = require('util');
var geo = require('geojson-utils');
var twitter = require('twitter');
var yargs = require('yargs');

// Manage arguments
yargs = yargs
  .default('lausanne', false)
  .default('help', false)
  .usage("Get tweets with filters.\nUsage: $0")
  .example('$0 --track hack --lausanne', 'Get every tweets from Lausanne AND containing the word "hack"')
  .example('$0 --username Binary_Brain --tags="Javascript, Web Dev"', 'Get every tweets sent by @Binary_Brain')
  
  .boolean('h')
  .options('h', {
    alias: 'help',
    describe: 'Show this help.'
  })
  
  .boolean('l')
  .options('l', {
    alias: 'lausanne',
    describe: 'Select tweets from Lausanne.'
  })
  
  .string('t')
  .options('t', {
    alias: 'track',
    describe: 'Select tweets containing the given keyword.'
  })
  
  .options('u', {
    alias: 'username',
    describe: 'Select tweets from username.'
  })
  
  .options('i', {
    alias: 'userid',
    describe: 'Select tweets from userid.'
  })
  
  .boolean('v')
  .options('v', {
    alias: 'verbose',
    describe: 'Verbose mode.'
  })
  
  .string('T')
  .options('T', {
    alias: 'tags',
    describe: 'Additional tags for the JSON separated by a comma.'
  })
  
  .check(function (argv) {
    if (!(argv.track || argv.lausanne || argv.userid || argv.username)) {
      return false
    }
  })
  
var argv = yargs.argv;

// Show help
if(argv.help) {
  console.log(yargs.help())
  process.exit(0)
}

// Verbose mode
var verbose = argv.verbose

// Twitter OAuth
var twit = new twitter({
    consumer_key: 'fiOe8DNdOE4AbriGXWsong',
    consumer_secret: 'U2tl45ya1ItkDFeXgFtU4dTAEDtmLEbDo0K2XJD0op8',
    access_token_key: '68448337-0LWfq5zMOFhRpYuaGZh1k0RIuUkcALVSOXYP1OL9u',
    access_token_secret: 'k1ZQRQcGy2AYpWUAqTl8qiYSXCXNKhXfkntoipMHfZvCk'
});

// Preparing filter options
var filterOptions = {}

// Geoloc at Lausanne
var loc = [6.5560, 46.5015, 6.6614, 46.5548] // Lausanne
var lausanneGeoloc = argv.lausanne

if(lausanneGeoloc) {
  filterOptions.locations = loc.join(',')
}

// Additional tags
var additionalTags = []

if(argv.tags) {
  additionalTags = additionalTags.concat(argv.tags.trim().split(/\s*[,;\/]\s*/))
}

if (filterOptions.track) {
  additionalTags.push(filterOptions.track)
}
if (filterOptions.follow) {
  additionalTags.push(filterOptions.follow)
}

// Track
var track

if(argv.track && typeof argv.track === 'string') {
  track = argv.track
  filterOptions.track = track
} else {
 track = false
}

// User ID
var userID

if(argv.userid && (typeof argv.userid === 'string' || typeof argv.userid === 'number')) {
  userID = argv.userid
  filterOptions.follow = userID
  getStream(filterOptions)
} else {
  // Username
  var username

  if(argv.username && typeof argv.username === 'string') {
    username = argv.username
  } else {
   username = false
  }

  if(username !== false) {
    if(username.substring(0, 1) === '@') {
      username = username.substring(1)
    }

    twit.get('https://api.twitter.com/1.1/users/show.json', { screen_name: username }, function (data) {
      if(data.id) {
        userID = data.id
        filterOptions.follow = userID
        getStream(filterOptions)
      }
      else {
        console.error("User "+username+" not found")
        process.exit(-1)
      }
    })
  }
  else {
    getStream(filterOptions)
  }
}

// Get an print the twitter stream
function getStream(options) {
  if(verbose) {
    console.info("options:", util.inspect(options))
  }
  if(!options || Object.keys(options).length === 0) {
    console.error("ERR:", "no option given to getStream")
    process.exit(-2)
  }
    
  if(options.track && options.follow) {
    delete options.track
  }

  twit.stream('statuses/filter', options, function (stream) {
    stream.on('data', function (data) {
      if(data.text === undefined || data.user === undefined || data.user.screen_name === undefined) {
        return;
      }
      
      var tweet = data.text
      var username = data.user.screen_name
      
      // check track
      if(track && !options.track) {
        if(!checkTrack(tweet, track)) {
          return
        }
      }
      
      // check location
      if (lausanneGeoloc && !isInBounds(loc, data)) {
        return;
      }
      
      printJSON(username, tweet, additionalTags)
    });
    
    stream.on('error', function (err) {
      console.error("ERR: "+err)
      process.exit(-3)
    });
  });
}

// Check if a tweet is within an area (loc)
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

// Convert a bounding box to a GeoJSON polygon
function boundingBoxToPolygon(box) {
  var a1 = Math.min(box[0], box[2])
  var a2 = Math.min(box[1], box[3])
  var b1 = Math.max(box[0], box[2])
  var b2 = Math.max(box[1], box[3])
  
  return { type: 'Polygon', coordinates: [[[a1, a2], [b1, a2], [b1, b2], [a1, b2]]] }
}

// Convert a GeoJSON polygon to a bounding box
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

// Check if two bounding boxes are overlapping.
function isOverlapping(box1, box2) {
  return (box1[0] <= box2[2] && box1[2] >= box2[0] &&
     box1[1] <= box2[3] && box1[3] >= box2[1])
}

// Check if the bounding box is small enough to be reliable
function boxIsSmall(box) {
  var limit = 0.2
  return (Math.abs(box[2]-box[0]) < limit && Math.abs(box[3]-box[1]) < limit)
}

function printJSON(username, tweet, additionalTags) {
    var tags = ['Twitter', '@'+username]
    tags = tags.concat(additionalTags)
    
    var json = {
      title: '@'+username,
      text: tweet,
      tags: tags
    }
    
    process.stdout.write(JSON.stringify(json) + '\n');
}

// Check if a tweet matches a track
function checkTrack(tweet, track) {
  var tracks = track.trim().split(/\s*[,;\/]\s*/)
  
  tracks = tracks.map(function (track) {
    return track.trim().split(/\s+/)
  })
  
  for(var i in tracks) {
    var track = tracks[i]
    
    if(checkAnd(tweet, track)) {
      return true
    }
  }
  
  return false
}

function checkAnd(tweet, track) {
  for(var j in track) {
    if(tweet.toLowerCase().indexOf(track[j].toLowerCase()) < 0) {
      return false
    }
  }
  
  return true
}