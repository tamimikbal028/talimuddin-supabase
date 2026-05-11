import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authHooks } from "@/hooks/useAuth";

// Zod Schema for Login
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// TypeScript type inferred from Zod schema
type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { mutate: login, isPending } = authHooks.useLogin();
  const [showPassword, setShowPassword] = useState(false);
  // Ref for focusing the password field
  const passwordRef = useRef<HTMLInputElement | null>(null);

  // React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Load remembered identifier from localStorage on mount
  useEffect(() => {
    const rememberedIdentifier = localStorage.getItem("rememberedIdentifier");
    if (rememberedIdentifier) {
      reset({
        email: rememberedIdentifier,
        password: "",
        rememberMe: true,
      });
      // Focus password field if identifier is already present
      setTimeout(() => passwordRef.current?.focus(), 0);
    }
  }, [reset]);

  // Form submit handler
  const onSubmit = (data: LoginFormData) => {
    // Remember Me: handle before logging in
    if (data.rememberMe) {
      localStorage.setItem("rememberedIdentifier", data.email);
    } else {
      localStorage.removeItem("rememberedIdentifier");
    }

    login({
      credentials: { email: data.email, password: data.password },
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5 px-5 py-10">
        {/* Header - Top on mobile, Left on desktop */}
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Talimuddin
          </h1>
          <h2 className="mb-2 text-xl font-semibold text-gray-700 sm:text-2xl">
            Welcome Back
          </h2>
        </div>

        {/* Login Form - Below on mobile, Right on desktop */}
        <div className="w-full max-w-[400px] rounded-lg border bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoFocus // Default focus here on page load
                  {...register("email")}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 transition-colors focus:ring-2 focus:outline-none ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    // Connecting Ref with Hook Form
                    ref={(e) => {
                      register("password").ref(e);
                      passwordRef.current = e;
                    }}
                    className={`w-full rounded-lg border px-3 py-2 pr-10 transition-colors focus:ring-2 focus:outline-none ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <NavLink
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </NavLink>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register NavLink */}
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <NavLink
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up here
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
