
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";

const PasswordInput = ({
  label = "Password",
  name,
  error,
  placeholder = "Enter password",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        label={label}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        error={error}
        className="pr-12"
        {...rest}
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-4 top-[38px] text-gray-400 transition hover:text-gray-700"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    </div>
  );
};

export default PasswordInput;
