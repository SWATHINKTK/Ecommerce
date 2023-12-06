const passport =  require('passport');
const { userData } = require('../models/userModal');
const bcrypt = require('bcrypt');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


// BCRYPT MODULE IS USED TO ENCRYPT THE PASSWORD DATA 
async function securePassword(password) {

    try {
        const secure = await bcrypt.hash(password, 10);
        return secure;
    } catch (error) {
        throw new Error('Encryption Error');
    }
}


// PASSPORT FUNCTION WORKING
passport.use(new GoogleStrategy({

        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:5000/auth/google/callback"

    },
    async function(request, accessToken, refreshToken, profile, done) {
   
        try {

            const userExist = await userData.findOne({email:profile.email});

            if(userExist){
                console.log('Exist')
                done(null, userExist);
            }else{

                console.log('NOT EXISt')

                const strongPassword = await securePassword(profile.id);
                
                const newUser = userData({
                    username: profile.displayName,
                    email: profile.email,
                    phonenumber: '',
                    password: strongPassword,
                    _isVerified: true,
                    joined_date: new Date()
                });
                
                const saveUser = await newUser.save();

                if(saveUser){
                    done(null, newUser);
                }
            }
        
        } catch (error) {
            done(error,false);
        } 
    }
));


// PASSPORT SERIALIZE USER
passport.serializeUser((user,done) => {
    done(null, user);
});


// PASS SERIALIZE USER
passport.deserializeUser(async(user,done)=>{
    try {
        done(null, user);
    } catch (error) {
        done(error,false)
    }
})