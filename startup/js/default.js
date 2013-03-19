 $(document).ready(function() {
 	$(".player .control").on("click", function() {
 		$(this).toggleClass("pause");
 		$(this).toggleClass("play");
 	});
 });