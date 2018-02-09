function loadGame(filename) {
    jsonPostRequest({
        url: "/game/load",
        data: JSON.stringify({ name: filename }),
    }, failure, success);
}

function saveGame(filename, success, failure) {
    jsonPostRequest({
        url: "/game/save",
        data: JSON.stringify({ name: filename }),
    },
        success,
        failure
    );
}

function getPlayers(success, failure) {
    getRequest({
        url: "/game/players",
    }, success, failure);
}

function setPlayers(players, success, failure) {
    jsonPostRequest({
        url: "/game/players",
        data: JSON.stringify(players),
    }, success, failure);
}

function getExam(round, success, failure) {
    getRequest({
        url: "/game/"+round+"/exam",
    }, success, failure)
}

function setExam(round, exam, success, failure) {
    jsonPostRequest({
        url: "/game/"+round+"/exam",
        data: JSON.stringify(exam),
    }, success, failure)
}