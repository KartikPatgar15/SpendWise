import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import ThemeSelector from "../components/ui/ThemeSelector";
import Logo from "../components/ui/Logo";
import { Sparkles, AlertCircle, LogIn, UserPlus, ArrowRight, User as UserIcon, Lock } from "lucide-react";

export default function Login() {
  const { login, register, loading } = useAuth();
  const { theme, setTheme, tokens: t } = useTheme();

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    if (mode === "login") {
      const res = await login(username.trim(), password);
      if (!res.success) {
        setError(res.error);
      }
    } else {
      const res = await register(username.trim(), password);
      if (!res.success) {
        setError(res.error);
      }
    }
  };

  const handleFillDemo = () => {
    setMode("login");
    setUsername("demo");
    setPassword("1234");
    setError("");
  };

  const isDemoFilled = username === "demo" && password === "1234";

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between ${t.bg} ${t.text} transition-colors duration-200 p-4 sm:p-6`}>
      {/* Top Header */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between pt-2 pb-4">
        <Logo variant="full" size="sm" />
        <ThemeSelector theme={theme} setTheme={setTheme} />
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto my-auto animate-fade-slide-up">
        <div className={`${t.card} ${t.border} border rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 backdrop-blur-md`}>
          {/* Header Title */}
          <div className="text-center space-y-1">
            <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${t.text}`}>
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className={`text-xs font-medium ${t.muted}`}>
              {mode === "login"
                ? "Sign in to access your financial dashboard"
                : "Register for your private, isolated expense account"}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "login"
                  ? "bg-white text-[#2F3E46] dark:bg-[#17242D] dark:text-[#22D3EE] shadow-xs scale-102"
                  : `${t.muted} hover:opacity-100`
              }`}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "register"
                  ? "bg-white text-[#2F3E46] dark:bg-[#17242D] dark:text-[#22D3EE] shadow-xs scale-102"
                  : `${t.muted} hover:opacity-100`
              }`}
            >
              <UserPlus size={14} />
              <span>Register</span>
            </button>
          </div>

          {/* Public Demo Info Banner */}
          {mode === "login" && (
            <div className="p-3 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#22D3EE]" />
                  <p className="text-[11px] font-extrabold text-[#22D3EE] uppercase tracking-wider">Public Demo Account</p>
                </div>
                <p className={`text-[11px] ${t.muted}`}>
                  Credentials are pre-filled (<span className="font-bold text-[#22D3EE]">demo</span> / <span className="font-bold text-[#22D3EE]">1234</span>). Click Login to explore freely!
                </p>
              </div>
              {!isDemoFilled && (
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#22D3EE]/20 text-[#22D3EE] hover:bg-[#22D3EE]/30 shrink-0 transition-colors"
                >
                  Fill Demo
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 text-[#FF5C5C] text-xs font-bold flex items-center gap-2 animate-fade-slide-up">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted} flex items-center gap-1`}>
                <UserIcon size={12} />
                <span>Username</span>
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className={`border rounded-xl px-3.5 py-2.5 w-full text-sm font-medium focus:outline-none transition-all duration-200 ${t.input}`}
                required
              />
            </div>

            <div className="space-y-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted} flex items-center gap-1`}>
                <Lock size={12} />
                <span>Password</span>
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`border rounded-xl px-3.5 py-2.5 w-full text-sm font-medium focus:outline-none transition-all duration-200 ${t.input}`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${t.btn.primary} w-full py-3.5 rounded-xl font-extrabold text-sm tracking-wide shadow-md active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating…</span>
                </>
              ) : mode === "login" ? (
                <>
                  <LogIn size={16} />
                  <span>{isDemoFilled ? "Login as Demo" : "Login"}</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch helper */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === "login" ? "register" : "login"));
                setError("");
              }}
              className={`text-xs font-semibold ${t.muted} hover:underline inline-flex items-center gap-1`}
            >
              <span>
                {mode === "login"
                  ? "Need a private account? Create one"
                  : "Already have an account? Sign in"}
              </span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-2">
        <p className={`text-[11px] font-medium ${t.muted}`}>
          SpendWise • Smart Expense Tracker & Financial Hub
        </p>
      </footer>
    </div>
  );
}
