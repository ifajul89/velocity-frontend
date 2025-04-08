import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    // Add your API logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md space-y-6 p-10">
        <div className="flex flex-col space-y-1">
          <h3 className="text-3xl font-bold tracking-tight">Sign Up</h3>
          <p className="text-muted-foreground text-sm">
            Please fill in the form to create an account.
          </p>
        </div>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
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
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
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
        <p className="text-center text-sm text-zinc-700 dark:text-zinc-300">
          Already have an account?{" "}
          <Link to={"/login"} className="font-semibold underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}
