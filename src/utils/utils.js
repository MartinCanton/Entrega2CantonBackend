import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename))

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const passportCall = (strategy, options = {}) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, options, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                if (info && info.name === 'TokenExpiredError') {
                    res.clearCookie('jwt', { httpOnly: true, secure: flase });
                    return res.status(401).json({ message: 'Token Expired' });
                } else if (info && info.name === 'NoAuthToken') {
                    return next({ status: 401, message: 'No auth token' });
                }
                return next();
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

export default __dirname;