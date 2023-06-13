import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { config } from "./index.js"
import User from '../models/user.model.js';

passport.use(
    new GoogleStrategy({
        clientID: config.google_client_ID,
        clientSecret: config.google_client_secret,
        callbackURL: config.google_callback_url,
        passReqToCallback : true
      },
      async (request, accessToken, refreshToken, profile, done) => {
         // Check if user with googleId exists
         const existingUser = await User.findOne({ googleId: profile.id });
         if (existingUser) {
          // Check if user with the same email already exists
          const userWithEmail = await User.findOne({ email: profile.emails[0].value });
          if (userWithEmail) {
            // Link the Facebook account with the existing user account
            userWithEmail.googleId = profile.id;
            await userWithEmail.save();
            return done(null, userWithEmail);
          }
        }
        if (!existingUser) {
          // Check if user with the same email already exists
          const userWithEmail = await User.findOne({ email: profile.emails[0].value });
          if (userWithEmail) {
            // Link the Facebook account with the existing user account
            userWithEmail.googleId = profile.id;
            await userWithEmail.save();
            return done(null, userWithEmail);
          }
        }
         
         // Create new user with googleId
         const user = new User({
           name: profile.displayName,
           email: profile.emails[0].value,
           googleId: profile.id,
           isVerified: true,
         });
 
         await user.save();
 
         done(null, user);
      }
    )
  );
  
  passport.use(
    new FacebookStrategy(
      {
        clientID: config.facebook_app_id,
        clientSecret: config.facebook_app_secret,
        callbackURL: config.facebook_callback_url,
        profileFields: ['id', 'displayName', 'email'],
        // state: true
      },
     async ( accessToken, refreshToken, profile, done) => {
        const id = profile.id;
        const displayName = profile.displayName;
        const email = profile.emails ? profile.emails[0].value : null;
        
        
        console.log(id, displayName, email)
       // Check if user with facebookId exists
       const existingUser = await User.findOne({ facebookId: profile.id });
       if (existingUser) {
        return done(null, existingUser);
         // Check if user with the same email already exists
        //  const userWithEmail = await User.findOne({ email });
        //  if (userWithEmail) {
        //    // Link the Facebook account with the existing user account
        //    userWithEmail.facebookId = id;
        //    await userWithEmail.save();
        //    return done(null, userWithEmail);
        //  }
      }

       // Create new user with facebookId
       const user = new User({
         name: displayName,
         email,
         facebookId: id,
         isVerified: true,
       });

       await user.save();

       done(null, user);
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
  
