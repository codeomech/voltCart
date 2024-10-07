import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLoginUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "@/store/auth-slice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = {
      email,
      password,
    };
    // Dispatch login action
    dispatch(loginUser(loginData))
      .unwrap()
      .then((response) => {
        if (response.success) {
          toast({
            title: "Login Successful!",
            description: "Full Shopping Mode On!",
          });
          navigate("/"); // Navigate to homepage or any other route
        } else {
          setErrorMessage(response.message);
          toast({
            title: "Something Went Wrong",
            description: response.message,
          });
        }
      })
      .catch((error) => {
        setErrorMessage("An error occurred. Please try again.");
        toast({
          title: "Error",
          description: error,
        });
      });
  };

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        // Dispatch the googleLoginUser action
        const result = await dispatch(googleLoginUser(authResult["code"]));
        if (result.payload) {
          navigate("/");
          toast({
            title: "Login Successful!",
            description: "Full Shopping Mode On",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Please Try again Something is Wrong",
        description: error,
      });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => responseGoogle(codeResponse),
    onError: (error) => console.error("Google login error:", error),
    flow: "auth-code",
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Login to your account
          </CardTitle>
          <CardDescription>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button onClick={googleLogin} type="button" className="w-full">
              Login With Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
