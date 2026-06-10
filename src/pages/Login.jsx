import {
    useState,
  } from "react";
  
  import {
    loginUser,
  } from "../features/auth/authAPI";
  
  import {
    useAuth,
  } from "../context/AuthContext";
  
  const Login = () => {
    const {
      login,
    } = useAuth();
  
    const [email, setEmail] =
      useState("");
  
    const [
      password,
      setPassword,
    ] = useState("");
  
    const [
      loading,
      setLoading,
    ] = useState(false);
  
    const handleSubmit =
      async (e) => {
        e.preventDefault();
  
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
      <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden px-4 font-sans">
        {/* Premium ambient background glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
  
        <div className="relative w-full max-w-md z-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-6"
          >
            {/* Header & Logo */}
            <div className="flex flex-col items-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center shadow-lg shadow-slate-900/10">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                LeadFlow
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Enter your credentials to access your account
              </p>
            </div>
  
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wider uppercase ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-200 px-4 py-3 rounded-2xl text-slate-900 bg-white/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>
  
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wider uppercase ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-200 px-4 py-3 rounded-2xl text-slate-900 bg-white/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>
            </div>
  
            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>
                {loading
                  ? "Logging In..."
                  : "Login"}
              </span>
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default Login;