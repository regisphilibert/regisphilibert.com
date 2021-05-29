function animateTags(selector){
    selector.each(function(){
        animateTag($(this))
    })
}
function animateTag(el){
    var str = el.text()
    if( el.text().indexOf('%') !== -1 && !el.hasClass('rp-Tag--gauge')){
        var percent = str.substring(str.lastIndexOf(":")+1,str.lastIndexOf("%"));
        var gauge = $('<span />')
        gauge.html('#' + str).css('width', 0)
        el.addClass('rp-Tag--gauge').append(gauge)
        gauge.animate({
                width: percent + '%',
            },
            300 / percent * 100, 
            'easeOutCubic'
        );
    }
}