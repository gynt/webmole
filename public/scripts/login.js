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
        jsonPostRequest({
            url: "/session/login",
            data: JSON.stringify(serialize()),
        }, function(data) {
            alert(data);
        });
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
});