function WebGLBLAS(){
	this.render = function() {
		window.requestAnimationFrame(render, canvas);
		gl.clearColor(1.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		var vertexPosition = gl.getAttribLocation(program, "aVertexPosition");
		gl.enableVertexAttribArray(vertexPosition);
		var texturePosition = gl.getAttribLocation(program, "aTextureCoord");
		gl.enableVertexAttribArray(texturePosition);
		//set attributes to using a 3d float
		gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
		gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);

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
	var square = new Float32Array([
		-1.0, -1.0,
		1.0, -1.0,
		-1.0,  1.0,
		-1.0,  1.0,
		1.0, -1.0,
		1.0,  1.0
	]);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, square, gl.STATIC_DRAW);

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
		//jsut sample the texture directly
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
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	initTextures();

	//run the thing
	this.render();
};
