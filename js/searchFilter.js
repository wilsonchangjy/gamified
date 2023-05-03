$('.search-icon').click(function(){
    $(this).toggleClass("click");
    $('.search').toggleClass("show");
});

$("#sort").click(function(){
    $("#sort-display").toggleClass("click");
    $("#sort-menu").toggleClass("show");
});

$("#filter").click(function(){
    $("#filter-display").toggleClass("click");
    $("#filter-menu").toggleClass("show");
});

$('.sort-option').click(function(){
    $('.sort-option').toggleClass("click", false);
    $(this).toggleClass("click");
    $("#sort-display").text($(this).text());
});

$('.filter-option').click(function(){
    if ($('.filter-option').hasClass("click")) {
        $('.filter-display').text("Multiple");
    }
    else {
        $('.filter-display').text($(this).text());
    }

    $(this).toggleClass("click");
    $("#filter-menu").toggleClass("show", false);
})