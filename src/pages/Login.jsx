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
    
    <div className="h-screen w-full flex overflow-hidden bg-slate-100">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 h-full bg-[#1E3A8A] text-white relative">

        <div className="flex flex-col justify-center px-16 w-full z-10">

          <h1 className="text-5xl font-bold leading-tight">
            Factory
            <br />
            Management
            <br />
            System
          </h1>

          <p className="mt-8 text-lg text-blue-100 leading-8 max-w-lg">
            Manage products, stock, production, sales, labour and reports
            from one secure dashboard.
          </p>

          <div className="mt-12 flex gap-4">

            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/10">
              <h3 className="font-semibold text-lg">Products</h3>
              <p className="text-sm text-blue-100 mt-1">
                Manage products & stock
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/10">
              <h3 className="font-semibold text-lg">Sales</h3>
              <p className="text-sm text-blue-100 mt-1">
                Billing & reports
              </p>
            </div>

          </div>

        </div>

        {/* Decorative Circle */}

        <div className="absolute -bottom-36 -left-36 h-96 w-96 rounded-full bg-blue-400/20"></div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex w-full lg:w-1/2 h-full items-center justify-center px-8">

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-10">

          <div className="mb-10">

            <h2 className="text-3xl font-bold text-slate-800">
              Welcome Back
            </h2>

            <p className="mt-2 text-slate-500">
              Sign in to continue to your dashboard.
            </p>

          </div>

     <form
  onSubmit={handleSubmit(onSubmit)}
  className="space-y-6"
>

            {/* EMAIL */}

        <div>

  <label className="text-sm font-medium text-slate-700">
    Email Address
  </label>

  <div className="mt-2 flex items-center rounded-xl border border-slate-300 h-14 px-4 focus-within:border-[#1E3A8A] transition">

    <Mail className="text-slate-400" size={20} />

    <input
      type="email"
      placeholder="Enter your email"
       autoComplete="email"
      {...register("email")}
      className="flex-1 bg-transparent outline-none px-3"
    />

  </div>

  {errors.email && (
    <p className="mt-2 text-sm text-red-500">
      {errors.email.message}
    </p>
  )}

</div>

            {/* PASSWORD */}

         <div>

  <label className="text-sm font-medium text-slate-700">
    Password
  </label>

  <div className="mt-2 flex items-center rounded-xl border border-slate-300 h-14 px-4 focus-within:border-[#1E3A8A] transition">

    <Lock
      className="text-slate-400"
      size={20}
    />

    <input
      type="password"
      
       autoComplete="current-password"
      placeholder="Enter your password"
      {...register("password")}
      className="flex-1 bg-transparent outline-none px-3"
    />

  </div>

  {errors.password && (
    <p className="mt-2 text-sm text-red-500">
      {errors.password.message}
    </p>
  )}

</div>

            {/* REMEMBER */}

            <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 text-sm text-slate-600">

                <input
                  type="checkbox"
                  className="w-4 h-4"
                />

                Remember me

              </label>

            </div>

            {/* BUTTON */}
<button
  type="submit"
  className="w-full h-14 rounded-xl bg-[#1E3A8A] hover:bg-[#17307A] text-white text-lg font-semibold transition-all duration-300"
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