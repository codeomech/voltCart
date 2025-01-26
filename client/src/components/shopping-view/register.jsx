import React, { useState } from "react";
import axios from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLoginUser } from "@/store/auth-slice";
import { registerUser, verifyOtp } from "@/store/auth-slice";
import { MODAL_TYPES } from "@/context/DialogContext";
import googleIcon from "../../assets/google_icon.svg";

const RegisterDialog = ({ openModal, closeModal }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const REGEXP_ONLY_DIGITS_AND_CHARS = /^[0-9]+$/;
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      userName,
      email,
      password,
    };

    // Dispatch the registerUser action
    dispatch(registerUser(formData))
      .unwrap()
      .then((response) => {
        if (response.success) {
          setIsOtpSent(true);
          toast({
            title: "OTP sent to your email",
            description: "yayayaya we're excited",
          });
        } else {
          toast({
            title: response.message,
          });
        }
      })
      .catch((err) => {
        toast({
          title: "Something wrong happened",
          description: err,
        });
      });
  };

  const handleVerifyOtp = async () => {
    const otpData = { email, otp };
    dispatch(verifyOtp(otpData))
      .then((response) => {
        if (response?.payload?.success) {
          toast({
            title: "Email Verified Successfully🎉",
            description: "You're Logged In",
          });
          navigate("/");
          closeModal();
        } else {
          toast({
            title: "Invalid OTP",
            description: "Please check once again",
          });
        }
      })
      .catch((err) => {
        const errorMessage = err.message || "Invalid OTP, please check again";
        toast({
          title: "Invalid OTP",
          description: errorMessage,
        });
      });
  };

  const responseGoogle = async (authResult) => {
    try {
      const result = await dispatch(googleLoginUser(authResult["code"]));
      if (result.payload) {
        closeModal();
        navigate("/");
        toast({ title: "Login Successful!", description: "Welcome back!" });
      }
    } catch (error) {
      toast({ title: "Login Failed", description: "Try again." });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => console.error("Google login error:", error),
    flow: "auth-code",
  });

  return (
    <>
      {!isOtpSent ? (
        <div>
          <DialogHeader className="space-y-1">
            <DialogTitle className="lg:text-2xl font-bold text-xl ">
              Create your account
            </DialogTitle>
            <DialogDescription>
              <p className="lg:text-left lg:text-sm text-xs">
                Already have an account?{" "}
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={() => openModal(MODAL_TYPES.LOGIN_MODAL)}
                >
                  Login here
                </span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="lg:space-y-4 space-y-2">
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {message && <p className="text-red-500">{message}</p>}
            <DialogFooter className="py-5 flex justify-center align-middle gap-4">
              <Button
                type="submit"
                className="w-full text-white py-2 bg-slate-950 rounded-lg hover:bg-slate-900 transition duration-200"
              >
                Register
              </Button>
              <Button
                onClick={googleLogin}
                type="button"
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center justify-center space-x-2"
              >
                <img src={googleIcon} alt="Google Icon" className="w-8 h-8" />
                <span>Google</span>
              </Button>
            </DialogFooter>
          </form>
        </div>
      ) : (
        <div>
          <DialogHeader>
            <DialogTitle> OTP Verification</DialogTitle>
            <DialogDescription>
              Don't have an account?{" "}
              <span
                onClick={() => openModal(MODAL_TYPES.REGISTER_MODAL)}
                className="text-blue-600 cursor:pointer"
              >
                Sign Up
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button type="button" onClick={handleVerifyOtp}>
            Verify OTP
          </Button>
        </div>
      )}
    </>
  );
};

export default RegisterDialog;
