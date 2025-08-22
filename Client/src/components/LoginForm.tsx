import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../App.css";

type LoginResponse = {
  message: string;
  user?: { name: string; email: string };
};
type ErrorResponse = {
  error: string;
  details?: {
    email?: string;
    password?: string;
  };
};

const Login = () => {
  const location = useLocation();
  const prefilledEmail = (location.state as { email?: string })?.email || "";
  const [email, setEmail] = useState<string>(prefilledEmail);
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
  }, [prefilledEmail]);

  // Email regex pattern (same as register)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear specific field error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        general: undefined,
      }));
    }

    // Update field value
    switch (field) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post<LoginResponse>(
        "https://server-gn9a.onrender.com/login",
        {
          email: email.trim().toLowerCase(),
          password,
        }
      );

      // Store user data in localStorage
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // Show success message briefly
      setErrors({ general: "Login successful! Redirecting..." });

      setTimeout(() => {
        navigate("/welcome");
      }, 1000);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      const errorData = err.response?.data;

      if (errorData?.details) {
        // Handle validation errors with details
        const newErrors: typeof errors = {};
        if (errorData.details.email) newErrors.email = errorData.details.email;
        if (errorData.details.password)
          newErrors.password = errorData.details.password;
        setErrors(newErrors);
      } else {
        // Handle single error messages
        const errorMessage = errorData?.error || "Something went wrong";

        // Check for specific server errors
        if (
          errorMessage.toLowerCase().includes("email") &&
          !errorMessage.toLowerCase().includes("password")
        ) {
          setErrors({ email: errorMessage });
        } else if (
          errorMessage.toLowerCase().includes("password") &&
          !errorMessage.toLowerCase().includes("email")
        ) {
          setErrors({ password: errorMessage });
        } else {
          // For "Invalid email or password" type messages, show as general error
          setErrors({ general: errorMessage });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General error message */}
          {errors.general && (
            <div
              className={`text-sm text-center p-2 rounded-md ${
                errors.general.includes("successful")
                  ? "text-green-400 bg-green-900/20"
                  : "text-red-400 bg-red-900/20"
              }`}
            >
              {errors.general}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-100"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white border ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-indigo-500"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-100"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white border ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-indigo-500"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              } transition-colors duration-200`}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* Register link */}
        <p className="mt-10 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
