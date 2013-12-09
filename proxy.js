var http = require('http'),
    urlparser = require('url');

// Transfer the header from the proxied response to the current response
function copyHeaders(from_headers, to_obj) {
	//console.log("Copying headers: ", from_headers);
	for (var hd in from_headers) {
		if (from_headers.hasOwnProperty(hd)) {
			if (hd!=="host") {
				// console.log("copyHeaders: " + hd + "=" + from_headers[hd]);
				to_obj.setHeader(hd, from_headers[hd]);
			} 
		}
	};
};

/**
 * PROXY
 * - Creates a http.request based on the dest_url and write the received output to
 *   the provided response object.
 * - request_body is used for PUT and POST to send content to the proxied server
 */
function proxyRequest(dest_url, request, response, request_body) {
	// Retrieve the data from destination URL
	var dest_part = urlparser.parse(dest_url, true),
		method = request.method,
		options = {
			"hostname": dest_part.hostname,
			"path": dest_part.path,
			"method": request.method
		};
	
    // Set the HTTP port if in the URL
	if (dest_part.port) {
		options.port = parseInt(dest_part.port, 10);
	}
	
    // Create the proxied request
	// console.log("Creating proxy call to " + dest_url + " with options:\n", options);
	var req = http.request(options, function (res) {
		
		// Check if redirect
		var location = res.headers['location'];

		if (location && location !== dest_url) {
			// console.log("Redirecting to: ", location);
			// End the current request and create a new one by recursively calling proxyRequest
			req.abort();
			proxyRequest(location, request, response, request_body);
		} else {
			// Transfer the header information
			copyHeaders(res.headers, response);
			// console.log("Http Status Code: " + res.statusCode);
			response.statusCode = res.statusCode;

			// Transfer the response.body
			res.on("data", function (chunk) {
				//console.log("chunk:", chunk.toString());
				response.write(chunk);
			});
			
			// Transfer completed
			res.on("end", function () {
				//console.log("end");
				response.end();
			});
		}

	})
	
	if (request_body) {
		// console.log("PUT/POST Body:", request_body);
		
		// Copy the request header into 
		copyHeaders(request.headers, req);
		
		req.write(request_body);
	}
	
	req.end();
};


/**
 * Make a node.js module. Usage:
 * - proxy = require("./proxy")();
 */
module.exports = function () {
	return {
        request: proxyRequest
    };
};


