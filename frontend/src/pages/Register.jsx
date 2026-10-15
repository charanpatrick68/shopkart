import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCustomer } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnterToNextField = (event) => {
    if (event.key !== "Enter" || event.target.tagName !== "INPUT") return;

    event.preventDefault();
    const inputs = Array.from(event.currentTarget.querySelectorAll("input:not([disabled])"));
    const nextInput = inputs[inputs.indexOf(event.target) + 1];

    if (nextInput) {
      nextInput.focus();
    } else {
      event.currentTarget.requestSubmit();
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await registerCustomer(formData);
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf1e8] sm:p-6">
      <div className="mx-auto grid min-h-screen max-w-6xl overflow-hidden bg-white sm:min-h-[min(760px,calc(100dvh-3rem))] sm:shadow-lg lg:grid-cols-2">
        <aside className="relative flex min-h-[190px] flex-col justify-between bg-cover bg-center p-6 text-white sm:p-10 lg:min-h-full" style={{ backgroundImage: "linear-gradient(0deg, rgba(17,37,25,.78), rgba(17,37,25,.12)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400')" }}>
          <Link to="/register" className="text-lg font-bold tracking-tight">shopkart</Link>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e2f39b]">Good things, gathered</p>
            <p className="max-w-sm font-[Fraunces] text-3xl leading-tight sm:text-4xl">A little inspiration for everyday living.</p>
          </div>
        </aside>
        <section className="flex items-center px-6 py-10 sm:px-12">
          <div className="mx-auto w-full max-w-md">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#648064]">YOUR SHOPKART ACCOUNT</p>
        <h1 className="mb-1 text-3xl text-[#202720]">Create your account</h1>
        <p className="mb-6 text-sm text-[#69736a]">Join ShopKart and start finding your favourites.</p>

        {serverError && (
          <div className="mb-4 rounded-sm border border-[#efd6d1] bg-[#fff8f6] px-3 py-2 text-sm text-[#9b5146]">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} onKeyDown={handleEnterToNextField} noValidate className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#465148]">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              autoComplete="name"
              autoFocus
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-sm border border-[#dce2d8] bg-white px-3 py-3 text-sm outline-none focus:border-[#326246] focus:ring-2 focus:ring-[#dce9d1]"
              placeholder="Jane Doe"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#465148]">
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-sm border border-[#dce2d8] bg-white px-3 py-3 text-sm outline-none focus:border-[#326246] focus:ring-2 focus:ring-[#dce9d1]"
              placeholder="jane@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#465148]">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-sm border border-[#dce2d8] bg-white px-3 py-3 text-sm outline-none focus:border-[#326246] focus:ring-2 focus:ring-[#dce9d1]"
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#465148]">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-sm border border-[#dce2d8] bg-white px-3 py-3 text-sm outline-none focus:border-[#326246] focus:ring-2 focus:ring-[#dce9d1]"
              placeholder="9876543210"
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-[#255a40] py-3 text-sm font-semibold text-white transition hover:bg-[#1d4933] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#69736a]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#326246] hover:underline">
            Log in
          </Link>
        </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
