$(document).ready(function() {
	function setSizeMainImage() {
		var imageWidth = $("#images_list").width()/3-10;
		$.each($("#images_list img"), function(key, value) {
			$(value).width(imageWidth);
			$(value).next().width(imageWidth);
		});	
	}

	setSizeMainImage();

	$(window).resize(function() {
		setSizeMainImage();
	});
	
});