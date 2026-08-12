import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../validation/authValidation";
import { loginUser } from "../services/authService";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccess, setLoading } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));

      const response = await loginUser(data);

      dispatch(loginSuccess(response.data.data.user));

      toast.success(response.data.message);

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex overflow-x-hidden">

      {/* =====================================================
          LEFT SIDE - DESKTOP ONLY
      ====================================================== */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-[#1E3A8A] text-white relative overflow-hidden">

        <div className="relative z-10 flex min-h-screen w-full flex-col justify-center px-10 xl:px-16 2xl:px-20">

          <div className="max-w-xl">

            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-[1.08]">
              Factory
              <br />
              Management
              <br />
              System
            </h1>

            <p className="mt-6 xl:mt-8 max-w-lg text-base xl:text-lg leading-7 xl:leading-8 text-blue-100">
              Manage products, stock, production, sales, labour
              and reports from one secure dashboard.
            </p>

            <div className="mt-8 xl:mt-12 flex flex-wrap gap-3 xl:gap-4">

              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md xl:px-6 xl:py-5">
                <h3 className="text-base xl:text-lg font-semibold">
                  Products
                </h3>

                <p className="mt-1 text-xs xl:text-sm text-blue-100">
                  Manage products & stock
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md xl:px-6 xl:py-5">
                <h3 className="text-base xl:text-lg font-semibold">
                  Sales
                </h3>

                <p className="mt-1 text-xs xl:text-sm text-blue-100">
                  Billing & reports
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-400/20 xl:h-96 xl:w-96" />

        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-blue-300/10 xl:h-96 xl:w-96" />

      </div>


      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:w-1/2 lg:px-10 xl:px-12">

        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-xl sm:rounded-3xl sm:px-8 sm:py-8 md:px-10 md:py-9">

          {/* Header */}
          <div className="mb-7 sm:mb-8 md:mb-9">

            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Sign in to continue to your dashboard.
            </p>

          </div>


          {/* =================================================
              FORM
          ================================================== */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 sm:space-y-6"
          >

            {/* EMAIL */}
            <div>

              <label className="text-sm font-medium text-slate-700">
                Email Address
              </label>

              <div
                className={`mt-2 flex h-12 w-full items-center rounded-xl border px-3 transition sm:h-14 sm:px-4 ${
                  errors.email
                    ? "border-red-400"
                    : "border-slate-300 focus-within:border-[#1E3A8A]"
                }`}
              >

                <Mail
                  className="shrink-0 text-slate-400"
                  size={19}
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register("email")}
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-base"
                />

              </div>

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 sm:text-sm">
                  {errors.email.message}
                </p>
              )}

            </div>


            {/* PASSWORD */}
            <div>

              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <div
                className={`mt-2 flex h-12 w-full items-center rounded-xl border px-3 transition sm:h-14 sm:px-4 ${
                  errors.password
                    ? "border-red-400"
                    : "border-slate-300 focus-within:border-[#1E3A8A]"
                }`}
              >

                <Lock
                  className="shrink-0 text-slate-400"
                  size={19}
                />

                <input
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-base"
                />

              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 sm:text-sm">
                  {errors.password.message}
                </p>
              )}

            </div>


            {/* REMEMBER */}
            <div className="flex items-center">

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">

                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-[#1E3A8A]"
                />

                <span>Remember me</span>

              </label>

            </div>


            {/* BUTTON */}
            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#1E3A8A] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#17307A] active:scale-[0.99] sm:h-14 sm:text-base"
            >
              Sign In
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;