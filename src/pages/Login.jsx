import {
  useState,
} from "react";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  FileText,
  TrendingUp,
} from "lucide-react";

import {
  useAuth,
} from "../context/AuthContext";
import {
  loginUser,
} from "../features/auth/authAPI";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      try {
        setLoading(true);
        const response =
          await loginUser({
            email,
            password,
          });

        login(
          response.data.user,
          response.data.token
        );
        window.location.reload();
      } catch (error) {
        alert(
          error?.response?.data
            ?.message ||
          "Login Failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main className="min-h-screen bg-[#f8f8f7] p-3 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1400px] overflow-hidden rounded-[28px] bg-[#efefee] lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="relative z-10 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#202020] text-white">
              <TrendingUp className="h-6 w-6" />
            </span>
            <span className="text-xl font-bold">LeadFlow</span>
          </div>

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-[#6553a9]">
              Your entire sales operation, together
            </span>
            <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-[#202020]">
              Build momentum without the busywork.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Move from lead to quotation, order, dispatch, invoice, and payment inside one beautifully calm workspace.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              {[
                [FileText, "Quotations"],
                [Boxes, "Operations"],
                [BarChart3, "Insights"],
              ].map(([Icon, label]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-white/70 p-4 backdrop-blur"
                >
                  <Icon className="h-5 w-5 text-[#6553a9]" />
                  <p className="mt-5 text-sm font-bold">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lf-orb -right-10 top-24 opacity-80" />
          <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#d8ceff]/70 blur-3xl" />
        </section>

        <section className="flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-xl shadow-black/[0.04] sm:p-9"
          >
            <div className="mb-8 lg:hidden">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#202020] text-white">
                <TrendingUp className="h-5 w-5" />
              </span>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b75dc]">
              Welcome back
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#202020]">
              Sign in to LeadFlow
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your workspace credentials to continue.
            </p>

            <div className="mt-8 space-y-5">
              <label className="block space-y-2">
                <span className="text-xs font-bold text-slate-600">
                  Email address
                </span>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-[#fbfbfa] px-4 text-sm outline-none transition focus:border-[#a996ef] focus:ring-4 focus:ring-[#a996ef]/10"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold text-slate-600">
                  Password
                </span>
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-[#fbfbfa] px-4 text-sm outline-none transition focus:border-[#a996ef] focus:ring-4 focus:ring-[#a996ef]/10"
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#202020] text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-black disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Continue"}
              {!loading && (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>

            <p className="mt-6 text-center text-xs text-slate-400">
              Secure access to your LeadFlow workspace
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
