function Handler(router) {
    this.admin = {username:"admin",password:"admin"};
    this.users = [];
    this.router=router;
    var self = this;
    this.onLogin = function(req, res) {
        if(req.body.username==self.admin.username && req.body.password==self.admin.password) {
            req.session.logged_in=true;
            req.session.is_admin=true;
            res.send({status:"welcome",message:"welcome admin!", code:5});
        } else {
            var users = self.onGetUsers();
            var candidates = users.filter((el) => el.username == req.body.username);
            if(candidates.length!=1) {
                res.send({status:"error",message:"incorrect username",code:3});
            } else {
                if(candidates[0].password != req.body.password) {
                    res.send({status:"error", message:"incorrect password",code:4});
                } else {
                    req.session.logged_in=true;
                    req.session.is_admin=false;
                    req.session.username = req.body.username;
                    res.send({status:"welcome",message:"welcome player!",code:6});
                }
            }
        }     
    }
    this.router.post("/login", this.onLogin);
    this.onLogout = function(req, res) {
        req.session.destroy();
        res.send({status:"goodbye",message:"logged out!",code:7});
    }
    this.router.post("/logout", this.onLogout);
}

Handler.prototype.test = function() {
    console.log(self);

}

Handler.prototype.isLoggedIn = function(req) {
    return req.session.logged_in===true;
};

Handler.prototype.isAdmin = function(req) {
    return this.isLoggedIn(req) && req.session.is_admin===true;
}

Handler.prototype.onGetUsers = function() {
    return this.users;
}

module.exports.Handler = Handler;