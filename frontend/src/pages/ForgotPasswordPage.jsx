import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";
import CloudflareTurnstile from "../components/CloudflareTurnstile";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Steps: "email" | "reset" | "success"
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({ otp: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [cfToken, setCfToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email || errors.form) {
      setErrors((p) => ({ ...p, email: "", form: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((p) => ({ ...p, [name]: "", form: "" }));
    }
  };

  const validateEmailStep = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email)) {
      e.email = "Please enter a valid email";
    }
    if (!cfToken) e.cf = "Please complete the verification";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateResetStep = () => {
    const e = {};
    if (!form.otp.trim()) e.otp = "Verification code is required";
    else if (!/^\d{6}$/.test(form.otp)) e.otp = "OTP must be a 6-digit number";
    
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.confirmPassword !== form.password) {
      e.confirmPassword = "Passwords do not match";
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRequestOTP = async (ev) => {
    ev.preventDefault();
    if (!validateEmailStep()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", {
        email,
        cfTurnstileToken: cfToken,
      });
      toast.success(data.message || "Verification code sent to your email.");
      setStep("reset");
    } catch (err) {
      const rd = err.response?.data;
      if (rd?.errors) {
        const fe = {};
        rd.errors.forEach((e) => {
          const field = e.field === "cfTurnstileToken" ? "cf" : e.field;
          fe[field] = e.message;
        });
        setErrors(fe);
      } else {
        const message = rd?.message || "Failed to request code. Please try again.";
        setErrors((p) => ({ ...p, form: message }));
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (ev) => {
    ev.preventDefault();
    if (!validateResetStep()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", {
        email,
        otp: form.otp,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      toast.success(data.message || "Password reset successfully.");
      setStep("success");
    } catch (err) {
      const rd = err.response?.data;
      if (rd?.errors) {
        const fe = {};
        rd.errors.forEach((e) => {
          fe[e.field] = e.message;
        });
        setErrors(fe);
      } else {
        const message = rd?.message || "Failed to reset password. Please check your verification code.";
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
        <img
          src="/images/login-hero.webp"
          alt="Premium leather goods craftsmanship"
          className="absolute inset-0 w-full h-full object-cover animate-scale-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-canvas/10" />

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
            Securing Your
            <br />
            <em style={{ fontStyle: "italic", color: "#C9A97A" }}>
              Wholesale Access.
            </em>
          </h2>
          <p className="text-paper/55 text-sm font-light leading-relaxed max-w-xs">
            Verify identity and restore access to your account quickly and securely.
          </p>
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

          {step === "email" && (
            <>
              <p className="eyebrow mb-2">Account Recovery</p>
              <h1
                className="text-espresso mb-2"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: "2rem",
                  fontWeight: 400,
                }}
              >
                Forgot Password?
              </h1>
              <p className="text-fog text-sm font-light mb-8">
                Enter your email address to receive a verification code.
              </p>

              <form onSubmit={handleRequestOTP} className="space-y-5">
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
                      value={email}
                      onChange={handleEmailChange}
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

                {/* Turnstile */}
                <div className="animate-fade-up stagger-2">
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

                <div className="animate-fade-up stagger-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3.5"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin-slow" />
                        Sending code…
                      </span>
                    ) : (
                      <>
                        Send Verification Code <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center animate-fade-up stagger-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-fog hover:text-espresso text-[13px] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </Link>
                </div>
              </form>
            </>
          )}

          {step === "reset" && (
            <>
              <p className="eyebrow mb-2">Verify Identity</p>
              <h1
                className="text-espresso mb-2"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: "2rem",
                  fontWeight: 400,
                }}
              >
                Reset Password
              </h1>
              <p className="text-fog text-sm font-light mb-8">
                Enter the verification code sent to <strong>{email}</strong> and set your new password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* OTP Code */}
                <div className="animate-fade-up stagger-1">
                  <label className="block text-[11px] tracking-widest uppercase text-fog font-medium mb-2">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fog/60" />
                    <input
                      name="otp"
                      type="text"
                      maxLength={6}
                      value={form.otp}
                      onChange={handleChange}
                      placeholder="123456"
                      className={`field pl-11 ${errors.otp ? "field-error" : ""}`}
                    />
                  </div>
                  {errors.otp && (
                    <p className="mt-1.5 text-[11px] text-rust flex items-center gap-1 animate-fade-in">
                      <AlertCircle className="w-3 h-3" />
                      {errors.otp}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="animate-fade-up stagger-2">
                  <label className="block text-[11px] tracking-widest uppercase text-fog font-medium mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fog/60" />
                    <input
                      name="password"
                      type={showPw ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      className={`field pl-11 pr-11 ${errors.password ? "field-error" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fog/50 hover:text-fog transition-all duration-200"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-[11px] text-rust flex items-center gap-1 animate-fade-in">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="animate-fade-up stagger-3">
                  <label className="block text-[11px] tracking-widest uppercase text-fog font-medium mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fog/60" />
                    <input
                      name="confirmPassword"
                      type={showConfirmPw ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      className={`field pl-11 pr-11 ${errors.confirmPassword ? "field-error" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fog/50 hover:text-fog transition-all duration-200"
                    >
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-[11px] text-rust flex items-center gap-1 animate-fade-in">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
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
                        Updating password…
                      </span>
                    ) : (
                      <>
                        Reset Password <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center animate-fade-up stagger-5">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setErrors({});
                    }}
                    className="inline-flex items-center gap-2 text-fog hover:text-espresso text-[13px] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Email Entry
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "success" && (
            <div className="text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <h1
                className="text-espresso mb-3"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: "2rem",
                  fontWeight: 400,
                }}
              >
                Password Reset!
              </h1>
              
              <p className="text-fog text-sm font-light leading-relaxed mb-8">
                Your password has been changed successfully. You can now log in to your account with your new credentials.
              </p>

              <Link
                to="/login"
                className="btn-primary w-full justify-center py-3.5 inline-flex"
              >
                Sign In Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
