const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);
//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP(); // Generate OTP

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      authProvider: "local",
      otp, // Store the OTP in the user record
    });

    await newUser.save();

    // Send OTP to the user's email
    await transporter.sendMail({
      from: '"Your App" <your-email@gmail.com>',
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP for verifying your email is ${otp}`,
    });

    res.status(200).json({
      success: true,
      message: "Registration successful! OTP has been sent to your email",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

//nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "harshitmangla16@gmail.com", // replace with your email
    pass: "uuou khzf wghk ofgf", // replace with your app password
  },
});
// verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp === otp) {
      user.isEmailVerified = true;
      user.otp = undefined; // Clear the OTP
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          email: user.email,
          userName: user.userName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "60m" }
      );

      const userData = user.toObject();
      delete userData.password;

      // Set token in cookie and respond
      res.cookie("token", token, { httpOnly: true, secure: false }).json({
        success: true,
        message: "Email verified successfully and logged in!",
        user: userData,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first.",
      });
    }

    // Check if the email is verified
    if (!checkUser.isEmailVerified) {
      return res.json({
        success: false,
        message:
          "Email is not verified. Please verify your email before logging in.",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};
const googleLogin = async (req, res) => {
  const { code } = req.body;

  try {
    // Initialize OAuth2Client
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "postmessage"
    );

    // Exchange authorization code for tokens
    const { tokens } = await client.getToken(code);

    // Verify the ID token to get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    // Check if the user already exists in the database
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        userName: name,
        email,
        image: picture,
        isEmailVerified: true,
        authProvider: "google",
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    // Set token in cookie and respond
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully with Google",
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
        userName: user.userName,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  logoutUser,
  authMiddleware,
  googleLogin,
};
