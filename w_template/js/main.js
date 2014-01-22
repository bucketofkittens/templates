function showShadow() {
	$("#shadow").addClass("show");
}
function hideShadow() {
	$("#shadow").removeClass("show");
}

$(document).ready(function() {
	$(".accept, .decline, .decline_call, .accept_call").on("click", function() {
		showShadow();
		return false;
	});

	$(".decline, .decline_call").on("click", function() {
		$("#modal2").addClass("show");
	});

	$(".modal .close").on("click", function() {
		hideShadow();
		$(".modal").removeClass("show");
	});
});