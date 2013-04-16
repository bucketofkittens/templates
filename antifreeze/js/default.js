$(document).ready(function(){

	if(!Modernizr.input.placeholder) {

		$('[placeholder]').focus(function() {
		  var input = $(this);
		  if (input.val() == input.attr('placeholder')) {
			input.val('');
			input.removeClass('placeholder');
		  }
		}).blur(function() {
		  var input = $(this);
		  if (input.val() == '' || input.val() == input.attr('placeholder')) {
			input.addClass('placeholder');
			input.val(input.attr('placeholder'));
		  }
		}).blur();
		$('[placeholder]').parents('form').submit(function() {
		  $(this).find('[placeholder]').each(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
			  input.val('');
			}
		  })
		});
	}

	if (window.PIE) {
        $('.two-cell .right ul li span').each(function() {
            PIE.attach(this);
        });
    }

    if (!Modernizr.textshadow) {
    	$('.left_nav ul li a, .left_nav2 li a, .two-cell .right table th, footer ul a, #content .com .plu .sort h3, header ul li:not(.current) a, #content .adv section a p, #content .adv section a i').textShadow('1px 1px 2px #666666');
    	$('header ul li.current a').textShadow('1px 1px 2px #ffffff');
	}
    
});