import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "@/redux/features/auth/authApi";
import SignUpBG from "@/assets/register/register.jpeg";
import { toast } from "sonner";
import VeloV from "@/assets/velocity-logo.png";
import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  password: string;
};

// Define type for backend error response
type ErrorData = {
  message?: string;
  status?: boolean;
  error?: string;
};

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const [SignUp] = useSignUpMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
      // phone: '01319101783',
      // city: "Dhaka"
    };

    try {
      // Add your API logic here
      const response = await SignUp(userInfo);

      // Check if response has an error
      if ("error" in response) {
        // Handle error response
        const errorResponse = response.error;
        if (errorResponse && "data" in errorResponse && errorResponse.data) {
          // Try to extract message from error data
          const errorData = errorResponse.data as ErrorData;
          if (errorData.message) {
            toast.error(errorData.message);
          } else {
            toast.error("Registration failed. Please try again.");
          }
        } else {
          toast.error("Registration failed. Please try again.");
        }
        return;
      }

      // Handle successful response
      if (response.data && response.data.status) {
        toast.success(response.data.message || "Registration successful!");
        navigate("/login");
        reset();
      } else if (response.data && response.data.message) {
        toast.error(response.data.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="my-8 grid w-full max-w-[900px] grid-cols-1 overflow-hidden rounded-xl border-none shadow-md md:grid-cols-2">
        <div
          style={{
            backgroundImage: `url(${SignUpBG})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="bg-velo-black/50">
            <div className="relative flex h-[150px] w-full items-center px-1 sm:h-[200px] md:h-[650px]">
              <img
                className="absolute top-3 left-3 w-5 md:top-6 md:left-6 md:w-10"
                src={VeloV}
                alt=""
              />
              <h3 className="text-velo-white px-3 text-2xl font-bold md:px-6 md:pb-20 md:text-5xl md:leading-[70px] lg:text-6xl">
                Welcome
                <br />
                User!
              </h3>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col justify-center gap-4 p-5 md:gap-8 md:p-10">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Sign Up
          </h1>
          <p className="text-gray-400 md:text-[17px]">
            Welcome User! Please Sign Up to create Account
          </p>
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 md:space-y-7"
            >
              <div className="space-y-2">
                <Input
                  id="name"
                  placeholder="Enter your name"
                  className="border-velo-black/30 h-10 rounded-none border-0 border-b shadow-none focus:outline-none focus-visible:ring-0 focus-visible:outline-none md:text-lg"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  className="border-velo-black/30 h-10 rounded-none border-0 border-b shadow-none focus:outline-none focus-visible:ring-0 focus-visible:outline-none md:text-lg"
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
                <Input
                  id="password"
                  className="border-velo-black/30 h-10 rounded-none border-0 border-b shadow-none focus:outline-none focus-visible:ring-0 focus-visible:outline-none md:text-lg"
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
              <Button
                type="submit"
                className="bg-velo-red hover:bg-velo-maroon h-11 w-full md:text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </div>

          <p className="text-muted-foreground text-center text-sm md:text-base">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-velo-red hover:text-velo-maroon font-semibold underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
