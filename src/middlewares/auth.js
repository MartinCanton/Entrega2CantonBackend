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
        res.redirect('/profile');
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

export const passportCall = (strategy, options = {}) => {
    return async (req, res, next ) => {
        passport.authenticate(strategy, options, (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                if (info && info.name === "TokenExpiredError"){
                    res.clearCookie('jwt', {httpOnly: true, secure:false });
                    return res.status(401).json({ message: "Token Expirado"});
                } else if (info && info.name === 'NoAuthToken') {
                    return next({ status: 401, message: "Token no autorizado"});
                }
                return next();
            }
            req.user = user;
            next();
        }) (req, res, next);
    };
}