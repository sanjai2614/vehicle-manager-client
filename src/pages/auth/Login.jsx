
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CarFront } from "lucide-react";

import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";

import { loginSchema } from "../../validations/auth.validation";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../utils/toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isLoading } = useAuth();

  const successMessage = location.state?.message;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      const data = await login(formData);

      showToast.success("Login successful!");

      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      const responseData = error.response?.data;

      let errorMessage = "Something went wrong. Please try again.";

      if (responseData) {
        const firstError =
          typeof responseData === "string"
            ? responseData
            : Object.values(responseData)
                .flat(Infinity)
                .find((item) => typeof item === "string");

        if (firstError) errorMessage = firstError;
      } else {
        errorMessage = "Unable to connect to the server. Please try again.";
      }

      showToast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <CarFront size={28} className="text-blue-700" />

          <span className="text-xl font-bold text-gray-900">
            Vehicle<span className="text-blue-700">Manager</span>
          </span>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Sign in to access your account.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
