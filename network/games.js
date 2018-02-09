function Handler(router) {
    this.game=undefined;
    this.router = router;
    var self = this;

    this.ok = function (res, message) {
        res.send({data:message, status:"ok"});//Object.assign({data: message}, { status: "ok" }));
    }

    this.router.all("*", function (req, res, next) {
        if (req.session.is_admin) {
            next();
        } else {
            res.send({ status: "unauthorized" });
        }
    });

    this.saveGame = function(req, res) {
        self.getEngine().saveGame(self.getGame(), req.body.name || "game.json");
        self.ok(res);
    }
    this.router.post("/save", this.saveGame);

    this.loadGame = function(req, res) {
        try {
            self.setGame(self.getEngine().loadGame(req.body.name || "game.json"));
            self.ok(res);
        } catch(e) {
            res.send({status:"error",message:e});
        }     
    }
    this.router.post("/load", this.loadGame);

    this.getPlayers = function (req, res) {
        self.ok(res, self.getGame().players);
    };
    this.router.get('/players', this.getPlayers);

    this.setPlayers = function (req, res) {
        self.getGame().players = req.body;
        self.ok(res);
    }
    this.router.post('/players', this.setPlayers);

    this.getRound = function (req, res) {
        self.ok(res, self.getGame().rounds[req.params.round]);
    }
    this.router.get('/round/:round', this.getRound);

    this.getRounds = function (req, res) {

        self.ok(res, self.getGame().rounds.length);

    }
    this.router.get('/rounds', this.getRounds);

    this.addRound = function (req, res) {

        self.getGame().rounds.append(undefined);
        self.ok(res);

    }
    this.router.post('/round/add', this.addRound);

    this.removeRound = function (req, res) {

        self.getGame().rounds.pop();
        self.ok(res);

    }
    this.router.post('/round/remove', this.removeRound);

    this.getRoundPart = function (req, res) {

        self.ok(res, self.getGame().rounds[req.params.round][req.params.part]);

    }
    this.router.get('/round/:round/:part', this.getRoundPart);

    this.setRoundPart = function (req, res) {
        self.getGame().rounds[req.params.round][req.params.part] = req.body;
        self.ok(res);
    }
    this.router.post('/round/:round/:part', this.setRoundPart);
}

Handler.prototype.setGame = function(game) {
    this.game=game;
}

Handler.prototype.getGame = function () {
    return this.game;
}

Handler.prototype.getEngine = function() {
    return undefined;
}

module.exports.Handler = Handler;