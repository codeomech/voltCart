import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser, verifyOtp } from "@/store/auth-slice";

const Register = () => {
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
    console.log(otp);
    const otpData = { email, otp };
    dispatch(verifyOtp(otpData))
      .then((response) => {
        if (response?.payload?.success) {
          toast({
            title: "Email Verified Successfully🎉",
            description: "You're Logged In",
          });
          navigate("/");
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

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!isOtpSent ? (
        <div>
          <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Create your account
              </CardTitle>
              <CardDescription>
                Have an account?{" "}
                <Link to="/login" className="text-blue-600">
                  Log in now
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <Button type="submit" className="w-full">
                  Register
                </Button>
                <Button type="button" className="w-full">
                  Login With Google
                </Button>
              </form>
              <div className="mt-4 text-center">
                {/* Add link to switch to OTP form */}
                <p>
                  Already Registered?{" "}
                  <span
                    onClick={() => setIsOtpSent(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Verify OTP
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                OTP Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Register;
