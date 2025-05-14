import React, { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPay, setShowPay] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      // ✅ 打印调试信息
      console.log("Response status:", res.status);
      const text = await res.text();
      console.log("Response body:", text);
  
      if (!res.ok) {
        throw new Error("Login failed");
      }
  
      const data = JSON.parse(text); // 不再使用 res.json() 避免已消费错误
      const token = data.token;
  
      localStorage.setItem("authToken", token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Incorrect username or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      {!showSignup && !showForgot && !showPay && (
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">
            Welcome Digital Data Distribution Display Platform
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
            >
              Login
            </button>
            <div className="flex justify-between text-sm text-indigo-700 mt-4">
              <button type="button" onClick={() => setShowSignup(true)}>Sign up</button>
              <button type="button" onClick={() => setShowForgot(true)}>Forgot password?</button>
            </div>
          </form>
        </div>
      )}

      {showSignup && (
        <Modal title="Sign Up" onClose={() => setShowSignup(false)}>
          <form className="space-y-3">
            <input type="text" placeholder="Username" className="w-full border px-3 py-2 rounded" />
            <input type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" />
            <input type="password" placeholder="Password" className="w-full border px-3 py-2 rounded" />
            <input type="text" placeholder="Contact Name (Optional)" className="w-full border px-3 py-2 rounded" />
            <input type="text" placeholder="Phone (Optional)" className="w-full border px-3 py-2 rounded" />
            <input type="text" placeholder="Company Name (Optional)" className="w-full border px-3 py-2 rounded" />
            <input type="text" placeholder="Address (Optional)" className="w-full border px-3 py-2 rounded" />
            <button
              type="button"
              className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-50"
              onClick={() => setShowPay(true)}
            >
              Pay Subscription (Optional)
            </button>
            <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Register
            </button>
          </form>
        </Modal>
      )}

      {showForgot && (
        <Modal title="Forgot Password" onClose={() => setShowForgot(false)}>
          <form className="space-y-4">
            <input type="email" placeholder="Enter your email" className="w-full border px-3 py-2 rounded" />
            <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Send Reset Link
            </button>
          </form>
        </Modal>
      )}

      {showPay && (
        <Modal title="Pay Subscription" onClose={() => setShowPay(false)}>
          <form className="space-y-4">
            <input type="text" placeholder="Card Number" className="w-full border px-3 py-2 rounded" />
            <input type="text" placeholder="Name on Card" className="w-full border px-3 py-2 rounded" />
            <div className="flex space-x-2">
              <input type="text" placeholder="MM/YY" className="w-1/2 border px-3 py-2 rounded" />
              <input type="text" placeholder="CVV" className="w-1/2 border px-3 py-2 rounded" />
            </div>
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
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


