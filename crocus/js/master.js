$(document).ready(function() {
	$('.scroll-pane').jScrollPane({
		horizontalDragMaxWidth: 89
	});

	console.log(window.PIE);
	if (window.PIE) {
        $('#page #content .banner p, #page #content .banner ul li, #top-header-bg, #search').each(function() {
            PIE.attach(this);
        });
    }
});