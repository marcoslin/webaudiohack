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

// Obtain reference to HTML elements needed and create a socket connection to server
var volume_meter_L = document.getElementById("volume_meter_L"),
    volume_meter_R = document.getElementById("volume_meter_R"),
    audio = document.getElementById("audio"),
    socket = io.connect(document.location);



// Start processing audio info after load event
window.addEventListener('load', function(e) {
    setupAudioNodes();
}, false);






// Core section of the code to process audio
var javascriptNode;
function setupAudioNodes() {
    // Get the source from the audio tag
    var sourceNode = context.createMediaElementSource(audio);
    sourceNode.connect(context.destination);
    
    // setup a javascript node
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);

    // setup a analyzer
    var analyser_left = context.createAnalyser();
    analyser_left.smoothingTimeConstant = 0.3;
    analyser_left.fftSize = 1024;

    var analyser_right = context.createAnalyser();
    analyser_right.smoothingTimeConstant = 0.3;
    analyser_right.fftSize = 1024;

    // create a buffer source node
    splitter = context.createChannelSplitter();

    // connect the source to the analyser and the splitter
    sourceNode.connect(splitter);

    // connect one of the outputs from the splitter to
    // the analyser.  Channel 0 is LEFT and channel 1 is Right
    // http://www.w3.org/TR/webaudio/#ChannelSplitterNode-section
    splitter.connect(analyser_left,0,0);
    splitter.connect(analyser_right,1,0);

    // we use the javascript node to draw at a
    // specific interval.
    analyser_left.connect(javascriptNode);
    
    javascriptNode.onaudioprocess = function() {
 
       // get the average for the first channel
        var array_left =  new Uint8Array(analyser_left.frequencyBinCount);
        analyser_left.getByteFrequencyData(array_left);
        var average_left = getAverageVolume(array_left);
 
        // get the average for the second channel
        var array_right =  new Uint8Array(analyser_right.frequencyBinCount);
        analyser_right.getByteFrequencyData(array_right);
        var average_right = getAverageVolume(array_right);
        
        // As volume_meter is 300px, the width is therefore percent * 3
        volume_meter_L.style.width = average_left * 3;
        volume_meter_L.innerHTML = average_left;
        volume_meter_R.style.width = average_right * 3;
        volume_meter_R.innerHTML = average_right;
        
        // Send volume into to server
        socket.emit("volume_info", { "left": average_left, "right": average_right });
        
    }
    
}

// Return a average volume in percent
function getAverageVolume(array) {
    var values = 0,
        length = array.length;

    // get average for all the frequency amplitudes
    for (var i = 0; i < length; i++) {
        values += array[i];
    }
    var average = values / length;

    // Result from getByteFrequencyData is 0 to 255
    // http://stackoverflow.com/questions/14789283/what-does-the-fft-data-in-the-web-audio-api-correspond-to
    var average_percent = (average / 255) * 100;
    // return average_percent;
    return Math.round(average_percent);
}


