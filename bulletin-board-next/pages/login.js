import React, { useState } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";  // ✅ 用这个，重新安装后就不报错了

const API_BASE = "http://8.210.165.181:8081"; // auth-service 端口
const PAYMENT_API = "http://8.210.165.181:8085/api/payments/subscribe";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  // 支付表单状态
  const [cardInfo, setCardInfo] = useState({ cardNumber: "", cardName: "", expiry: "", cvv: "" });

  // 注册表单状态
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    contactName: "",
    phone: "",
    companyName: "",
    address: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    // 验证必填字段
    if (!username.trim()) {
      setLoginError("Please enter username");
      return;
    }
    if (!password.trim()) {
      setLoginError("Please enter password");
      return;
    }

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", res.status);
      const text = await res.text();
      console.log("Response body:", text);

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = JSON.parse(text);
      const token = data.token;

      // ✅ 解码 JWT 拿到用户信息
      const decoded = jwt_decode(token);

      // ✅ 存储 token 和用户信息（可跨页复用）
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUsername", decoded.username);
      localStorage.setItem("authRole", decoded.role);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setLoginError("Invalid username or password");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSignupError("");

    // 验证必填字段
    const requiredFields = {
      username: "username",
      email: "email",
      password: "password"
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!signupForm[field].trim()) {
        setSignupError(`Please enter ${label}`);
        return;
      }
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupForm.email)) {
      setSignupError("Please enter a valid email address");
      return;
    }

    try {
      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });
      if (!res.ok) throw new Error("Registration failed");
      alert("Registration successful");
      setShowSignup(false);
    } catch (err) {
      setSignupError("Registration failed. Please try again later");
    }
  };

  const handleForgot = async (email) => {
    try {
      const res = await fetch(`/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      alert(data.message);
    } catch {
      alert("Failed to send reset link");
    }
  };

  const handlePay = async () => {
    try {
      const res = await fetch(`/api/payments/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardInfo),
      });
      const data = await res.json();
      alert(data.message);
      setShowPay(false);
    } catch {
      alert("Payment failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      {!showSignup && !showForgot && !showPay && (
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">
            Welcome Digital Data Distribution Display Platform
          </h1>
          {loginError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username *"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password *"
              className="w-full border px-3 py-2 rounded"
            />
            <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Login
            </button>
            {/* <p>Test</p> */}
            <div className="flex justify-between text-sm text-indigo-700 mt-4">
              <button type="button" onClick={() => setShowSignup(true)}>Sign up</button>
              <button type="button" onClick={() => setShowForgot(true)}>Forgot password?</button>
            </div>
          </form>
        </div>
      )}

      {showSignup && (
        <Modal title="Sign Up" onClose={() => setShowSignup(false)}>
          {signupError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {signupError}
            </div>
          )}
          <form className="space-y-3" onSubmit={handleRegister}>
            {Object.entries(signupForm).map(([k, v]) => (
              <input
                key={k}
                type={k === "email" ? "email" : k === "password" ? "password" : "text"}
                placeholder={
                  (k === "username" || k === "email" || k === "password" ? "* " : "") +
                  (k[0].toUpperCase() + k.slice(1)) +
                  (k !== "contactName" && k !== "phone" && k !== "companyName" && k !== "address" ? "" : " (Optional)")
                }
                value={signupForm[k]}
                onChange={(e) => setSignupForm({ ...signupForm, [k]: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            ))}
            <button
              type="button"
              onClick={() => setShowPay(true)}
              className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-50"
            >
              Pay Subscription (Optional)
            </button>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Register
            </button>
          </form>
        </Modal>
      )}

      {showForgot && (
        <Modal title="Forgot Password" onClose={() => setShowForgot(false)}>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleForgot(e.target.email.value); }}>
            <input name="email" type="email" placeholder="Enter your email" className="w-full border px-3 py-2 rounded" />
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Send Reset Link
            </button>
          </form>
        </Modal>
      )}

      {showPay && (
        <Modal title="Pay Subscription" onClose={() => setShowPay(false)}>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePay(); }}>
            <input type="text" placeholder="Card Number" value={cardInfo.cardNumber} onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })} className="w-full border px-3 py-2 rounded" />
            <input type="text" placeholder="Name on Card" value={cardInfo.cardName} onChange={(e) => setCardInfo({ ...cardInfo, cardName: e.target.value })} className="w-full border px-3 py-2 rounded" />
            <div className="flex space-x-2">
              <input type="text" placeholder="MM/YY" value={cardInfo.expiry} onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })} className="w-1/2 border px-3 py-2 rounded" />
              <input type="text" placeholder="CVV" value={cardInfo.cvv} onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })} className="w-1/2 border px-3 py-2 rounded" />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Pay Now
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Login;