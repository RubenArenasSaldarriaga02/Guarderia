module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/login');
    }

    ,isStudent(req,res,next){
        switch(req.user.rol_idrol){
            case 1: return res.redirect('/links/indexAdmin')
            case 2: return res.redirect('/links/indexprofe')
            case 3: return next()
        }
    }
    ,isTeacher(req,res,next){
        switch(req.user.rol_idrol){
            case 1: return res.redirect('/links/indexAdmin')
            case 2: return next()
            case 3: return res.redirect('/links/indexest')
        }
    },isAdmin(req,res,next){
        switch(req.user.rol_idrol){
            case 1: return next()
            case 2: return res.redirect('/links/indexprofe')
            case 3: return res.redirect('/links/indexest')
        }
    }

};