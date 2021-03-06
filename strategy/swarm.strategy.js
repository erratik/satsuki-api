const FoursquareStrategy = require('passport-foursquare').Strategy; 

module.exports = function (app, space, passport, refresh, savePassport, Setting, API_URL, CLIENT_URL) {

    Setting.findSettings(space, (settings) => {

        if (settings.oauth) {
            passport.use(new FoursquareStrategy({
                clientID: settings.oauth.filter(s => s.keyName === 'apiKey')[0].value,
                clientSecret: settings.oauth.filter(s => s.keyName === 'apiSecret')[0].value,
                callbackURL: `${API_URL}/auth/${space}/callback`
                // callbackURL: settings.oauth.filter(s => s.keyName === 'redirectUrl')[0].value
            },
                (accessToken, refreshToken, profile, done) => savePassport(space, settings, {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }, profile, done)
            ));
        }

    });

    app.get('/auth/swarm', passport.authenticate('foursquare', { scope: ['default', 'activity', 'location'] }));
    app.get('/auth/swarm/callback', passport.authenticate('foursquare', {
        successRedirect: `${CLIENT_URL}/space/${space}`,
        failureRedirect: CLIENT_URL
    }));

};
