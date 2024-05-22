let{ compare_passwords } = require('../CONTROLLERS/login_controller');

let UserDb = require('../DB/userdb');
let user_db = new UserDb();
let passportLocal = require("passport-local");
let passport  = require("passport");

let LocalStrategy = passportLocal.Strategy;
let verify_callback = async (req, email, password, done) => {
    try {
        let user = await user_db.get_user(email);
            
            if (!user) {
                return done(null, false);
            }
            if (user) {
                 console.log('matched the record ');
                //  console.log( user );
                let match = await compare_passwords(password, user.password);
                if (match === true) {
                    console.log('passwords are matched');
                    return done(null, user, null)
                } else {
                    return done(null, false)
                }
            }
        }
        catch (err) {
        console.log(err);
        return done(null, false);
    }
}

let strategy_options = {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
};

let initPassportLocal = () => {
    passport.use(new LocalStrategy(strategy_options,verify_callback))
};

passport.serializeUser((user, done) => {
    console.log ( 'serialize user method is called');
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    user_db.get_user(email).then((user) => {
        console.log('GOT THE USER FROM DESERILIZED METHOD ');
        // console.log( user);
        return done(null, user);
    }).catch(error => {
        console.log( 'ERROR ENCOUNTERED IN DESERILIZED METHOD');
        console.log( error.message);
        return done(error, null)
    });
});

module.exports = initPassportLocal;