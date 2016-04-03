$(window).load(function(){
	var blas = WebGLBLAS();
	var arr = [];
	var max = 50;
	var min = 0;
	for (var i = 0; i < 20; i++) {
		arr.push(Math.floor(Math.random() * (max - min + 1)) + min)
	}
	//arr.push(255);
	blas.scale(arr, 2);
});
