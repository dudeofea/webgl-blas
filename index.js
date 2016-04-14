$(window).load(function(){
	var blas = WebGLBLAS();
	var arr = [];
	var max = 50;
	var min = 0;
	for (var i = 0; i < 20000000; i++) {
		arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
	}
	//arr.push(255);
	var start = new Date().getTime();
	var ans = blas.scale(arr, 2);
	var end = new Date().getTime();

	var time = end - start;
	console.log(time, ans);

	var start = new Date().getTime();
	var ans = [];
	for (var i = 0; i < arr.length; i++) {
		ans[i] = arr[i] * 2;
	}
	var end = new Date().getTime();

	var time = end - start;
	console.log(time, ans);
});
