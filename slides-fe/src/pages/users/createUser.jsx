import React, { useState } from "react";
import { createUser } from "../../services/apis/userService";
import { errorMessage } from "../../services/axios";

const roles = [
  { value: "user", label: "User" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateUser = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.username) {
      newErrors.username = "Username is required";
    } else if (/\s/.test(form.username)) {
      newErrors.username = "Username must not contain spaces";
    }
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.role) {
      newErrors.role = "Role is required";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setSuccess("");
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    setSuccess("");
    try {
      await createUser({
        username: form.username,
        password: form.password,
        email: form.email,
        role: form.role,
      });
      setSuccess("User created successfully!");
      setForm({ username: "", password: "", email: "", role: "" });
    } catch (err) {
      setApiError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex justify-center items-start pt-10">
      <div className="w-full max-w-sm p-6 rounded-2xl border border-border-soft bg-bg-surface shadow-soft">
        <h2 className="text-xl font-bold text-center mb-6 text-text-primary">Create User</h2>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full h-10 px-3 rounded-xl border border-border-soft bg-bg-surface-strong text-text-primary text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted"
            />
            {errors.username && <p className="text-xs text-danger mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="w-full h-10 px-3 rounded-xl border border-border-soft bg-bg-surface-strong text-text-primary text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted"
            />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-xl border border-border-soft bg-bg-surface-strong text-text-primary text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted"
            />
            {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-xl border border-border-soft bg-bg-surface-strong text-text-primary text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted cursor-pointer"
            >
              <option value="">Select a role</option>
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {errors.role && <p className="text-xs text-danger mt-1">{errors.role}</p>}
          </div>

          {apiError && <p className="text-xs text-danger font-medium text-center">{apiError}</p>}
          {success && <p className="text-xs text-success font-medium text-center">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="ui-btn ui-btn--primary h-10 w-full"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
