function WebGLBLAS(){
	this.render = function() {
		window.requestAnimationFrame(render, canvas);
		gl.enable(gl.CULL_FACE);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		var vertexPosition = gl.getAttribLocation(program, "aVertexPosition");
		gl.enableVertexAttribArray(vertexPosition);
		var texturePosition = gl.getAttribLocation(program, "aTextureCoord");
		gl.enableVertexAttribArray(texturePosition);
		//set screen position attribute to use a 2d float and use the the vertexBuffer for positions
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

		//set texture position attribute to use a 2d float and use the texVertexBuffer for positions
		gl.bindBuffer(gl.ARRAY_BUFFER, texVertexBuffer);
		gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
		gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	//init the canvas
	var canvas = document.getElementById('test-canvas');
	var gl = canvas.getContext('experimental-webgl');
	canvas.width  = 512;
	canvas.height = 512;
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	//init the vertices for a square taking up the whole screen
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			-1.0, 1.0,		//top left
			-1.0, -1.0,		//bottom left
			1.0, 1.0,		//top right
			-1.0, -1.0,		//bottom left
			1.0, -1.0,		//bottom right
			1.0, 1.0		//top right
		]), gl.STATIC_DRAW
	);

	//init the vertices on the texture to draw corresponding with the above position vertices
	var texVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texVertexBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			0.0, 0.0,		//top left
			0.0, 1.0,		//bottom left
			1.0, 0.0,		//top right
			0.0, 1.0,		//bottom left
			1.0, 1.0,		//bottom right
			1.0, 0.0		//top right
		]), gl.STATIC_DRAW
	);

	//make the shaders, compile and link
	var vertexSource = `
	attribute vec2 aVertexPosition;		//our vertex position on screen
    attribute vec2 aTextureCoord;		//our position on the texture

	varying highp vec2 vTextureCoord;	//position on texture to pass to fragment shader
	void main() {
		//our positions on screen / on texture are unchanged
		gl_Position = vec4(aVertexPosition, 0, 1);
		vTextureCoord = aTextureCoord;
	}`;
	var fragmentSource = `
	varying highp vec2 vTextureCoord;	//our position on the texture
    uniform sampler2D uSampler;			//our sampler for the texture
	void main() {
		//just sample the texture directly
		gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
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

	//load the texture
	var initTextures = function() {
		cubeTexture = gl.createTexture();
		cubeImage = new Image();
		cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
		cubeImage.src = "cubetexture.png";
	}

	var handleTextureLoaded = function(image, texture) {
		console.log("handleTextureLoaded, image = " + image);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE, image);
		//use nearest-neighbour interpolation to avoid blurring errors
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	initTextures();

	//run the thing
	this.render();
};
