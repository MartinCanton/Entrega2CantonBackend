import passport from "passport";

export const isAuthenticated = (req, res, next) => {
    passport.authenticate('jwt', { session: false}, (err, user) =>{
        if (err || !user) {
            return res.status(401).send({ error: 'Necesitas Loguearte.'});
        }
        req.user = user;
        next();
    }) (req, res, next);
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.cookies.jwt) {
        return next();
    } else {
        res.redirect('/profie');
    }
};

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user)
            return res.status(401).send({ error: "No estas Autorizado" });
        if (req.user.role !== role)
            return res.status(403).send({ error: "No tienes permiso"});
        next();
    }
}