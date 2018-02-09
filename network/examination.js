function Handler(router, getGame) {
    this.getGame = getGame;
    this.router = router;
    var self = this;
    this.initial = function (req, res, next) {
        if (req.session.logged_in != true) {
            res.send({ status: "error", message: "not logged in", code: 1 });
            return;
        }
        if(self.getGame().current_round === undefined) {
            res.render('no-exam');
            return;
        }
        next();
    }
    router.all('*', this.initial);
    
    this.next =  function (req, res) {
        if (req.session.page === undefined) {
            self.onStart(req, res);
            return;
        } else {
            self.onPost(req, res);
            req.session.page += 1;

            self.nextPage(req, res);
        }
    }
    router.post('/next', this.next);

    this.onStart = function(req, res) {
        req.session.page = 0;
        self.getGame().current_round.exam.results[req.session.player] = {};
        self.getGame().current_round.exam.timings[req.session.player] = [Date.now()];
        res.send({ status: "begin", code: 2, message: "good luck!" });
    }

    this.onPost = function(req, res) {
        self.getGame().current_round.exam.results[req.session.player][req.session.page]=req.body;
    }

    this.nextPage = function(req, res) {
        if (req.session.page >= self.getGame().current_round.exam.items.length) {
            self.getGame().current_round.timings[req.session.player].append(Date.now());
            res.render('exam-finished', {});
        } else {
            self.renderItem(req, res);
        }
    }

    this.renderItem = function(req, res) {
        var item = self.getGame().current_round.exam[req.session.page];
        res.render('items/' + item.type.toString(), {exam: item});
    }
}

module.exports.Handler = Handler;