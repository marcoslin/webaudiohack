/*

Reference:

* http://updates.html5rocks.com/2012/02/HTML5-audio-and-the-Web-Audio-API-are-BFFs
* http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound

*/



// check if the default naming is enabled, if not use the chrome one.
if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
}
var context = new AudioContext();
var audioBuffer;
var sourceNode;

var volume_meter = document.getElementById("volume_meter"),
    dataout = document.getElementById("dataout"),
    audio = document.getElementById("audio");


window.addEventListener('load', function(e) {
    sourceNode = context.createMediaElementSource(audio);
    sourceNode.connect(context.destination);
    setupAudioNodes();
}, false);

var javascriptNode;
function setupAudioNodes() {
 
    // setup a javascript node
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    
    
    
    javascriptNode.onaudioprocess = function() {
 
        // get the average for the first channel
        var array =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var average = getAverageVolume(array);
    
        // get the average for the second channel
        //var array2 =  new Uint8Array(analyser2.frequencyBinCount);
        //analyser2.getByteFrequencyData(array2);
        //var average2 = getAverageVolume(array2);
    
        //console.log("array: ", array);
        volume_meter.style.width = average;
        dataout.innerHTML = average;
        
    }
    
    
    
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);

    // setup a analyzer
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;

    // create a buffer source node
    // sourceNode = context.createBufferSource();

    // connect the source to the analyser
    sourceNode.connect(analyser);

    // we use the javascript node to draw at a specific interval.
    analyser.connect(javascriptNode);

    // and connect to destination, if you want audio
   // sourceNode.connect(context.destination);
}


// load the specified sound
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // When loaded decode the data
    request.onload = function() {

        // decode the data
        context.decodeAudioData(request.response, function(buffer) {
            // when the audio is decoded play the sound
            playSound(buffer);
        }, onError);
    }
    request.send();
}




function playSound(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0);
}

// log if an error occurs
function onError(e) {
    console.log(e);
}



function getAverageVolume(array) {
        var values = 0;
        var average;
 
        var length = array.length;
 
        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }
 
        average = values / length;
    
        // return average;
    
        return Math.round(average);
    }







