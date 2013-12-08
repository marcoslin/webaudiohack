Web Audio Hack
============

Following [Firefox OS Mobile Hack Tea](http://www.meetup.com/codeinvaders/events/153091982/),
here is the cleaned up version of JavaScript code that:

1. Loads an audio file
2. Create a volume percentage number
3. Display this volume in a progress bar on a webpage
4. Send this volume info to a server

Implementation
============

The objective here is to use pure Javascript on a HTML5 browser without any 3rd party libraries.
The code is also kept as simple as possible, concentrating to deliver the object set above.

The audio is loaded using `<audio>` HTML5 tag and volume meter is based on a simple `<div>`.
Communication between web client and server is based on [`socket.io`](http://socket.io/).  On
the server side [`node-multimeter`](https://github.com/substack/node-multimeter) is used to generate the volume meter on the console.

Usage
============

After cloning this project, do:

1. `npm install`
1. `node server.js`
1. Open http://localhost:8080 using Chrome

Note
============

* This code only works on Google Chrome.  It won't work on Firefox due to the use a `.mp3` file
* If audio does not load, try to login to Deezer.com or substitude the audio source to a local
mp3 file.

Reference
============

* [Exploring the HTML5 Web Audio: visualizing sound ](http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound)
* [HTML5 <audio> and the Web Audio API are BFFs!](http://updates.html5rocks.com/2012/02/HTML5-audio-and-the-Web-Audio-API-are-BFFs)

