function getRequest(req, success, failure) {
    request(Object.assign({
        type: "GET",
    }, req), success, failure);
}

function jsonPostRequest(req, success, failure) {
    request(Object.assign({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }, req), success, failure);
}

function request(req, success, failure) {
    $.ajax(Object.assign({
        success: success,
        failure: failure
    }, req));
}