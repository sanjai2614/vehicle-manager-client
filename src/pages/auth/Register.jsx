
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CarFront } from "lucide-react";

import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";

import { registerSchema } from "../../validations/auth.validation";
import { useRegister } from "../../hooks/useAuthMutations";
import { showToast } from "../../utils/toast";

const Register = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await mutateAsync(formData);

      showToast.success("Registration successful!");

      navigate("/login", {
        replace: true,
        state: {
          message: "Registration successful! Please login.",
        },
      });
    } catch (error) {
      const data = error.response?.data;

      const firstError =
        typeof data === "string"
          ? data
          : data
            ? Object.values(data)
                .flat(Infinity)
                .find((item) => typeof item === "string")
            : null;

      showToast.error(
        firstError || "Registration failed. Please try again."
      );
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
            Create Account
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Register to manage your vehicle records.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <Input
            label="Username"
            placeholder="Enter username"
            error={errors.username?.message}
            {...register("username")}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="First name"
              error={errors.first_name?.message}
              {...register("first_name")}
            />

            <Input
              label="Last Name"
              placeholder="Last name"
              error={errors.last_name?.message}
              {...register("last_name")}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Create password"
            error={errors.password?.message}
            {...register("password")}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            error={errors.confirm_password?.message}
            {...register("confirm_password")}
          />

          <Button
            type="submit"
            size="lg"
            isLoading={isPending}
            className="w-full"
          >
            Create Account
          </Button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
