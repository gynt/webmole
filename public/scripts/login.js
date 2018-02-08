function serialize() {
    var result={};
    $.each( $("form :input"), function(i, n) { 
        if(n.name) {
            result[n.name] = $(n).val();
        } 
    });
    return result;
}

$(document).ready(function() {
    $("form").submit(function(e){
        $.ajax({
            type: "POST",
            url: "/session/login",
            data: JSON.stringify(serialize()),
            success: function(){},
            dataType: "json",
            contentType : "application/json"
        });
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
});