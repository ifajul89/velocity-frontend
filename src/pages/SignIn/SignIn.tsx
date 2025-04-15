import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSignInMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignIn() {
  const navigate = useNavigate();
  const [SignIn] = useSignInMutation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    // Call your API or auth logic here
    const userData = {
      email: data.email,
      password: data.password,
    };
    try {
      const res = await SignIn(userData);
      if (res.data.status) {
        // Save token to localStorage
        localStorage.setItem('token', res.data.data.token);
        
        // Pass the entire response to setUser, which now handles the nested structure
        dispatch(setUser(res.data));
        
        toast.success(res.data.message, { duration: 1000 });
        navigate("/");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      
      // Always show "Wrong password" for login errors
      toast.error("Wrong password or email. Please check your email and password and try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md space-y-6 p-7 shadow-lg sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight">Sign In</h1>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                placeholder="Enter your email address"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to={"/register"} className="font-semibold underline">
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
}
