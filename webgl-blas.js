function WebGLBLAS(){
	this.render = function() {
		window.requestAnimationFrame(render, canvas);
		gl.clearColor(1.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		var positionLocation = gl.getAttribLocation(program, "pixelPos");
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	//init the canvas
	var canvas = document.getElementById('test-canvas');
	var gl = canvas.getContext('experimental-webgl');
	canvas.width  = 640;
	canvas.height = 480;
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	//init the square shape for the whole screen
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			-1.0, -1.0,
			1.0, -1.0,
			-1.0,  1.0,
			-1.0,  1.0,
			1.0, -1.0,
			1.0,  1.0
		]),
		gl.STATIC_DRAW
	);

	//make the shaders, compile and link
	var vertexSource = `
	attribute vec2 pixelPos;
	void main() {
		gl_Position = vec4(pixelPos, 0, 1);
	}`;
	var fragmentSource = `
	uniform sampler2D u_sourceData;		//sampler for the 2d texture
	varying vec2 pixelPos;	//position of our pixel on the texture
	void main() {
		vec3 col = texture2D(u_sourceData, pixelPos).rgb;
		gl_FragColor = vec4(col, 1);
	}`;
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexSource);
	gl.compileShader(vertexShader);

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentSource);
	gl.compileShader(fragmentShader);

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.useProgram(program);

	//run the thing
	this.render();
};
