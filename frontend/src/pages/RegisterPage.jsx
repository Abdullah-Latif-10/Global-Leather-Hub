import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";
import CloudflareTurnstile from "../components/CloudflareTurnstile";

const requirements = [
  { label: "8+ characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Number", test: (p) => /[0-9]/.test(p) },
  { label: "Special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const isValidEmail = (e) =>
  /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(e);

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [cfToken, setCfToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [regEmail, setRegEmail] = useState("");
  const [resendCD, setResendCD] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name] || errors.form)
      setErrors((p) => ({ ...p, [name]: "", form: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    else if (form.username.length < 3) e.username = "Minimum 3 characters";
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      e.username = "Letters, numbers, underscores only";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Please enter a valid email";
    if (!form.password) e.password = "Password is required";
    else {
      const failed = requirements.filter((r) => !r.test(form.password));
      if (failed.length) e.password = failed[0].label + " required";
    }
    if (!cfToken) e.cf = "Please complete the verification";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        cfTurnstileToken: cfToken,
      });
      setRegEmail(form.email);
      setStep(2);
      toast.success(`Code sent to ${form.email}`);
    } catch (err) {
      const d = err.response?.data;
      if (d?.errors) {
        const fe = {};
        d.errors.forEach((e) => {
          const field = e.field === "cfTurnstileToken" ? "cf" : e.field;
          fe[field] = e.message;
        });
        setErrors(fe);
      } else {
        const message = d?.message || "Registration failed.";
        setErrors((p) => ({ ...p, form: message }));
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...otp];
    n[i] = v.slice(-1);
    setOtp(n);
    if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };
  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      document.getElementById(`otp-${i - 1}`)?.focus();
  };
  const handleOtpPaste = (e) => {
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (p.length === 6) setOtp(p.split(""));
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-email", {
        email: regEmail,
        otp: code,
      });
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      toast.success("Email verified! Welcome!");
      navigate("/profile");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code");
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCD > 0) return;
    try {
      await api.post("/auth/resend-otp", {
        email: regEmail,
        purpose: "email_verification",
      });
      toast.success("New code sent");
      setResendCD(60);
      const iv = setInterval(
        () =>
          setResendCD((p) => {
            if (p <= 1) {
              clearInterval(iv);
              return 0;
            }
            return p - 1;
          }),
        1000,
      );
    } catch {
      toast.error("Failed to resend code.");
    }
  };

  /* ── OTP Step ── */
  if (step === 2) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-6 py-20 page-enter">
        {/* Background leather texture */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <img
            src="/images/register-hero-new.jpg"
            alt=""
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        <div className="w-full max-w-sm animate-scale-in relative z-10">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-8">
              <span
                className="text-espresso text-xl"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Global Leather Hub
              </span>
            </Link>
            <div className="w-16 h-16 bg-tan/10 border border-tan/25 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-float">
              <Mail className="w-7 h-7 text-tan" />
            </div>
            <p className="eyebrow mb-3">Verify Email</p>
            <h2
              className="text-espresso"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: "2rem",
                fontWeight: 400,
              }}
            >
              Check Your Inbox
            </h2>
            <p className="text-fog text-sm font-light mt-3 leading-relaxed">
              We sent a 6-digit code to{" "}
              <span className="text-espresso font-medium">{regEmail}</span>
            </p>
          </div>

          <div className="card">
            <div
              className="flex justify-center gap-2.5 mb-7"
              onPaste={handleOtpPaste}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="otp-cell"
                  autoFocus={i === 0}
                  style={{ animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>
            <button
              onClick={handleVerify}
              disabled={loading || otp.join("").length !== 6}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin-slow" />
                  Verifying…
                </span>
              ) : (
                <>
                  Verify & Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="text-center mt-5 space-y-2">
              <p className="text-fog text-[13px]">
                Didn't get it?{" "}
                {resendCD > 0 ? (
                  <span className="text-fog/50">Resend in {resendCD}s</span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-tan hover:text-sienna font-medium transition-colors link-underline"
                  >
                    Resend code
                  </button>
                )}
              </p>
              <p className="text-fog text-[13px]">
                Wrong email?{" "}
                <button
                  onClick={() => setStep(1)}
                  className="text-espresso/60 hover:text-espresso transition-colors"
                >
                  Go back
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Register Form ── */
  return (
    <div className="min-h-screen bg-canvas flex page-enter">
      {/* Left photo panel — genuine leather / factory */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <img
          src="/images/register-hero-new.jpg"
          alt="Leather goods manufacturing"
          className="absolute inset-0 w-full h-full object-cover animate-scale-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/65 via-espresso/20 to-transparent" />

        <div className="absolute top-10 left-10 animate-fade-down stagger-2">
          <Link to="/">
            <span
              className="text-paper/90 text-2xl"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Global Leather Hub
            </span>
          </Link>
        </div>

        {/* Perks list */}
        <div className="absolute top-1/2 -translate-y-1/2 left-10 space-y-3 animate-fade-right stagger-4">
          {[
            "Access exclusive bulk pricing",
            "Private label & OEM available",
            "Dedicated account manager",
            "Trusted by 5,000+ wholesalers",
          ].map((perk, i) => (
            <div
              key={perk}
              className="flex items-center gap-3"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <CheckCircle className="w-4 h-4 text-tan flex-shrink-0" />
              <span className="text-paper/80 text-sm">{perk}</span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-10 left-10 right-16 animate-fade-up stagger-3">
          <h2
            className="text-paper font-normal leading-tight mb-3"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            }}
          >
            Join 5,000+
            <br />
            <em style={{ fontStyle: "italic", color: "#C9A97A" }}>
              Wholesalers Worldwide.
            </em>
          </h2>
          <p className="text-paper/50 text-sm font-light leading-relaxed max-w-xs">
            Access exclusive bulk pricing, private label options, and a
            dedicated account manager.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-[45%] flex items-start justify-center px-6 py-16 bg-paper overflow-y-auto">
        <div className="w-full max-w-[380px] animate-fade-up">
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

          <p className="eyebrow mb-2">New Account</p>
          <h1
            className="text-espresso mb-2"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "2rem",
              fontWeight: 400,
            }}
          >
            Create Account
          </h1>
          <p className="text-fog text-sm font-light mb-8">
            Join thousands of wholesale buyers worldwide.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="animate-fade-up stagger-1">
              <label className="block text-[11px] tracking-widest uppercase text-fog font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fog/60" />
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="e.g. john_doe"
                  className={`field pl-11 ${errors.username ? "field-error" : ""}`}
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-[11px] text-rust flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="animate-fade-up stagger-2">
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
                {form.email && isValidEmail(form.email) && (
                  <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sage animate-scale-in" />
                )}
              </div>
              {errors.email && (
                <p className="mt-1.5 text-[11px] text-rust flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="animate-fade-up stagger-3">
              <label className="block text-[11px] tracking-widest uppercase text-fog font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fog/60" />
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Strong password"
                  autoComplete="new-password"
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
              {form.password && (
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {requirements.map((r, i) => (
                    <div
                      key={r.label}
                      className={`flex items-center gap-1.5 text-[11px] transition-colors duration-300 ${r.test(form.password) ? "text-sage" : "text-fog/50"}`}
                    >
                      <CheckCircle
                        className={`w-2.5 h-2.5 transition-colors duration-300 ${r.test(form.password) ? "text-sage" : "text-border"}`}
                      />
                      {r.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Turnstile */}
            <div className="animate-fade-up stagger-4">
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

            <div className="animate-fade-up stagger-5">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3.5"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin-slow" />
                    Creating account…
                  </span>
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-fog text-[13px] animate-fade-up stagger-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-tan hover:text-sienna font-medium transition-colors link-underline"
              >
                Sign in
              </Link>
            </p>
          </form>

          <p className="text-center text-fog/40 text-[11px] mt-5">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
