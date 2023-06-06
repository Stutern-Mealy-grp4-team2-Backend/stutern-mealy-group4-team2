import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { config } from "./index.js"
import User from '../models/user.model.js';



passport.use(
    new GoogleStrategy(
      {
        clientID: config.google_client_ID,
        clientSecret: config.google_client_secret,
        callbackURL: config.google_callback_url,
      },
      async (accessToken, refreshToken, profile, done) => {
         // Check if user with googleId exists
         const existingUser = await User.findOne({ googleId: profile.id });
         if (existingUser) {
           return done(null, existingUser);
         }
         // Create new user with googleId
         const user = new User({
           name: profile.displayName,
           email: profile.emails[0].value,
           googleId: profile.id,
         });
 
         await user.save();
 
         done(null, user);
      }
    )
  );
  
  passport.use(
    new FacebookStrategy(
      {
        clientID: 'your-facebook-client-id',
        clientSecret: 'your-facebook-client-secret',
        callbackURL: 'http://localhost:3000/api/user/facebook/callback',
        profileFields: ['id', 'displayName', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user with facebookId exists
          const existingUser = await User.findOne({ facebookId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }
  
          // Create new user with facebookId
          const user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            facebookId: profile.id,
          });
  
          await user.save();
  
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
      done(null, user);
  });
  
  export default passport;