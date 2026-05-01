import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/authContext";
import CloudflareTurnstile from "../components/CloudflareTurnstile";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/profile";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [cfToken, setCfToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name] || errors.form)
      setErrors((p) => ({ ...p, [name]: "", form: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (
      !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(form.email)
    )
      e.email = "Please enter a valid email";
    if (!form.password) e.password = "Password is required";
    if (!cfToken) e.cf = "Please complete the verification";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        cfTurnstileToken: cfToken,
      });
      login(data.data);
      toast.success(`Welcome back, ${data.data.user.username}`);
      navigate(from, { replace: true });
    } catch (err) {
      const rd = err.response?.data;
      if (rd?.needsVerification) {
        toast.error("Email not verified.");
        navigate("/register");
        return;
      }
      if (rd?.errors) {
        const fe = {};
        rd.errors.forEach((e) => {
          const field = e.field === "cfTurnstileToken" ? "cf" : e.field;
          fe[field] = e.message;
        });
        setErrors(fe);
      } else {
        const message = rd?.message || "Login failed. Please try again.";
        setErrors((p) => ({ ...p, form: message }));
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex page-enter">
      {/* ── Leather photo panel ── */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        {/* Genuine leather texture / craftsmanship image */}
        <img
          src="/images/login-hero.webp"
          alt="Premium leather goods craftsmanship"
          className="absolute inset-0 w-full h-full object-cover animate-scale-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-canvas/10" />

        {/* Floating product thumbnails */}
        <div className="absolute top-1/3 right-8 space-y-3 animate-fade-left stagger-6 hidden xl:block">
          {[
            { label: "Leather Jackets", from: "$45/unit" },
            { label: "Leather Belts", from: "$8/unit" },
            { label: "Leather Wallets", from: "$12/unit" },
          ].map((p, i) => (
            <div
              key={p.label}
              className="bg-paper/10 backdrop-blur-sm border border-paper/20 rounded-xl px-4 py-2.5 text-right"
              style={{ animationDelay: `${0.8 + i * 0.15}s` }}
            >
              <p className="text-paper text-xs font-medium">{p.label}</p>
              <p className="text-tan text-[10px]">{p.from}</p>
            </div>
          ))}
        </div>

        {/* Brand overlay top */}
        <div className="absolute top-10 left-10 animate-fade-down stagger-2">
          <Link to="/">
            <span
              className="text-paper/90 text-2xl"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 400,
              }}
            >
              Global Leather Hub
            </span>
            <p className="text-paper/40 text-[10px] tracking-[0.3em] uppercase mt-0.5">
              Wholesale Platform
            </p>
          </Link>
        </div>

        {/* Bottom copy */}
        <div className="absolute bottom-10 left-10 right-16 animate-fade-up stagger-3">
          <h2
            className="text-paper font-normal leading-tight mb-3"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            }}
          >
            Premium Leather,
            <br />
            <em style={{ fontStyle: "italic", color: "#C9A97A" }}>
              Global Reach.
            </em>
          </h2>
          <p className="text-paper/55 text-sm font-light leading-relaxed max-w-xs">
            Exclusive wholesale pricing on jackets, belts, and wallets since
            2009.
          </p>
          <div className="flex gap-8 mt-6">
            {[
              { v: "50+", l: "Countries" },
              { v: "10K+", l: "Products" },
              { v: "5K+", l: "Partners" },
            ].map(({ v, l }) => (
              <div key={l}>
                <p
                  className="text-tan text-xl"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {v}
                </p>
                <p className="text-paper/40 text-[10px] tracking-widest uppercase mt-0.5">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 py-20 bg-paper">
        <div className="w-full max-w-[380px] animate-fade-up">
          {/* Mobile brand */}
          <div className="lg:hidden mb-10 text-center">
            <Link to="/">
              <span
                className="text-espresso text-2xl"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Global Leather Hub
              </span>
            </Link>
          </div>

          <p className="eyebrow mb-2">Welcome back</p>
          <h1
            className="text-espresso mb-2"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "2rem",
              fontWeight: 400,
            }}
          >
            Sign In
          </h1>
          <p className="text-fog text-sm font-light mb-8">
            Access your wholesale account and catalog.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="animate-fade-up stagger-1">
              <label className="block text-[11px] tracking-widest uppercase text-fog font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fog/60" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className={`field pl-11 ${errors.email ? "field-error" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-[11px] text-rust flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="animate-fade-up stagger-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] tracking-widest uppercase text-fog font-medium">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-tan hover:text-sienna transition-colors link-underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fog/60" />
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className={`field pl-11 pr-11 ${errors.password ? "field-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fog/50 hover:text-fog transition-all duration-200 hover:scale-110"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-[11px] text-rust flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Turnstile */}
            <div className="animate-fade-up stagger-3">
              <CloudflareTurnstile
                onVerify={(t) => {
                  setCfToken(t);
                  setErrors((p) => ({ ...p, cf: "" }));
                }}
                onExpire={() => setCfToken("")}
                onError={() =>
                  setErrors((p) => ({
                    ...p,
                    cf: "Verification failed. Please retry.",
                  }))
                }
              />
              {errors.cf && (
                <p className="mt-1.5 text-[11px] text-rust flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {errors.cf}
                </p>
              )}
            </div>

            {errors.form && (
              <p className="text-[12px] text-rust flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-3 h-3" />
                {errors.form}
              </p>
            )}

            <div className="animate-fade-up stagger-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3.5"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin-slow" />
                    Signing in…
                  </span>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-fog text-[13px] animate-fade-up stagger-5">
              No account?{" "}
              <Link
                to="/register"
                className="text-tan hover:text-sienna font-medium transition-colors link-underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
