import React, { useState } from "react";
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
import { MODAL_TYPES } from "@/context/DialogContext";
import { loginUser, googleLoginUser } from "@/store/auth-slice";
import googleIcon from "../../assets/google_icon.svg";

const LoginDialog = ({ openModal, closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { email, password };
    dispatch(loginUser(loginData))
      .unwrap()
      .then((response) => {
        if (response.success) {
          closeModal();
          toast({ title: "Login Successful!", description: "Welcome back!" });
          navigate("/");
        } else {
          setErrorMessage(response.message);
        }
      })
      .catch(() => setErrorMessage("An error occurred. Please try again."));
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
      <DialogHeader className="text-center">
        <DialogTitle className="text-2xl font-semibold text-gray-800">
          Login to Your Account
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          Don't have an account?{" "}
          <span
            onClick={() => openModal(MODAL_TYPES.REGISTER_MODAL)}
            className="text-blue-600 cursor-pointer font-medium hover:underline"
          >
            Sign Up
          </span>
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="lg:space-y-6 space-y-3">
        {/* Email Input */}
        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Password Input */}
        <div className="space-y-1">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Error Message */}
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        {/* Footer */}
        <DialogFooter className="flex justify-center align-middle">
          <Button
            type="submit"
            className="w-full text-white py-2 bg-slate-950 rounded-lg hover:bg-slate-900 transition duration-200"
          >
            Login
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
    </>
  );
};

export default LoginDialog;
