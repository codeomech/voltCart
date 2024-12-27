import React, { useState } from "react";
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
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { loginUser, googleLoginUser } from "@/store/auth-slice";

const LoginDialog = () => {
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
    <Dialog>
      {/* Button to open dialog */}
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
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
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
