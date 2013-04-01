$(function () {
  $("#page header a").click(function () {
    var elementClick = $(this).attr("href");
    var stp = 104;
    if(elementClick == "#wwt") {
    	stp = 190;
    }
    var destination = $(elementClick).offset().top - stp;
    $('html,body').animate({ scrollTop: destination }, 500);
    return false;
  });
});