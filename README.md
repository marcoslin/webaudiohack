Web Audio Hack
============

Following [Firefox OS Mobile Hack Tea](http://www.meetup.com/codeinvaders/events/153091982/),
here is the cleaned up version of JavaScript code that:

1. Loads an audio file
2. Create a volume percentage number
3. Display this volume in a progress bar on a webpage
4. Send this volume info to a server
5. Visualize the volume info on server

Implementation
============

The objective here is to use pure Javascript on a HTML5 browser without any 3rd party libraries.
The code is also kept as simple as possible, concentrating on delivering the objectives set above.

The audio is loaded using `<audio>` HTML5 tag and volume meter is based on a simple `<div>`.
Communication between web client and server is based on [`socket.io`](http://socket.io/).  On
the server side [`node-multimeter`](https://github.com/substack/node-multimeter) is used to generate the volume meter on the console.

Usage
============

After cloning this project, do:

1. `npm install`
1. `node server.js`
1. Open [http://localhost:8080/](http://localhost:8080/) using latest version of Chrome or Firefox

Note
============

* `proxy.js` has been created to make this work in Firefox. See 
  [this question](http://stackoverflow.com/questions/20469190/createmediaelementsource-method-of-web-audio-api-in-firefox)
  on Stackoverflow for more detail.
* Firefox 25.0.1 has a bug that when an HTML5 audio is interecepted, the sound progress does not work.  It will stay at
  initial position and jump directly to the end when sound is over.

Reference
============

* [Exploring the HTML5 Web Audio: visualizing sound ](http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound)
* [HTML5 <audio> and the Web Audio API are BFFs!](http://updates.html5rocks.com/2012/02/HTML5-audio-and-the-Web-Audio-API-are-BFFs)

