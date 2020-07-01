const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");


const socialSignup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data.", 422)
      );
    }
  
    const { name, email,  password, image } = req.body;
    
   
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  
    if (existingUser) {
      const error = new HttpError(
        "User exists already, please login instead.",
        422
      );
      return next(error);
    }
  
  
    const createdUser = new User({
      name,
      email,
      image,
      password,
      places: [],
    });
  
    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError(
        "Signing up failed,db please try again later.",
        500
      );
      return next(error);
    }
  
    let token;
    try {
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError(
        "Signing up failed,jw please try again later.",
        500
      );
      return next(error);
    }
  
    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token: token });

  };

  const socialLogin = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
  
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Logging in failed, please try again later.",
        500
      );
      return next(error);
    }
  
  
    
    if (!existingUser) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        403
      );
      return next(error);
    }
  
    let token;
    try {
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError(
        "Logging in failed, please try again later.",
        500
      );
      return next(error);
    }
    
    res.json({
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    });
  };




//Node.js Function to save image from External URL.
function saveImageToDisk(url, localPath) {var fullUrl = url;
var file = fs.createWriteStream(localPath);
var request = https.get(url, function(response) {
response.pipe(file);
});
}

exports.socialSignup = socialSignup; 
exports.socialLogin = socialLogin; 










