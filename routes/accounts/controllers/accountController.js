require('../../../lib/passport');


module.exports = {

    //render weather results page
    options:(req, res) => {
        if(req.isAuthenticated()){
            return res.render('auth/options');
        }else {
            return res.redirect('/fail');
        };
    },

    //render weather results page
    creditDebit:(req, res) => {
        if(req.isAuthenticated()){
            return res.render('auth/creditDebit');
        }else {
            return res.redirect('/fail');
        };
    }
} 