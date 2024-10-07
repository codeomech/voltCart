const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    },
    default: null,
  },
  googleId: {
    type: String,
    default: null,
  },
  profileImage: {
    type: String,
    default: null,
  },
  otp: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: "user",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
});

// Pre-save hook to handle Google users without password
UserSchema.pre("validate", function (next) {
  if (this.authProvider === "google") {
    this.password = null; // Ensure password is null for Google users
  }
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
