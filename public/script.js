$(document).ready(function(){
    $(window).on('scroll', function(){
        $("#scroll").fadeOut(1500, function(){
            $("#scroll").remove();
        });
    });
});