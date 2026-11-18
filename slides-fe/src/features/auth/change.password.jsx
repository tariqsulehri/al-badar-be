import React, { useState } from "react";
import { changePassword } from "../../services/apis/authService";
import { errorMessage } from "../../services/axios";
import { showToastNotification } from "../../helpers/notificationsHepler";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };
const MIN_LENGTH = 8; // matches the API's changePasswordSchema

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-border-soft bg-bg-surface-strong text-text-primary text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted";

const FIELDS = [
  { name: "currentPassword", label: "Current password", autoComplete: "current-password" },
  { name: "newPassword", label: "New password", autoComplete: "new-password", hint: `At least ${MIN_LENGTH} characters` },
  { name: "confirmPassword", label: "Confirm new password", autoComplete: "new-password" },
];

const validate = ({ currentPassword, newPassword, confirmPassword }) => {
  const errors = {};
  if (!currentPassword) errors.currentPassword = "Enter your current password";
  if (newPassword.length < MIN_LENGTH) errors.newPassword = `Use at least ${MIN_LENGTH} characters`;
  else if (newPassword === currentPassword) errors.newPassword = "Choose a password different from the current one";
  if (confirmPassword !== newPassword) errors.confirmPassword = "Passwords don't match";
  return errors;
};

const ChangePassword = () => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      showToastNotification("success", "Password changed");
      setForm(EMPTY);
    } catch (error) {
      setApiError(errorMessage(error, "Could not change password"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-center pt-6">
      <div className="w-full max-w-md rounded-2xl border border-border-soft bg-bg-surface p-6 shadow-soft">
        <h1 className="text-xl font-bold text-text-primary">Change password</h1>
        <p className="mt-1 mb-6 text-sm text-text-secondary">You&apos;ll stay signed in on this device.</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {FIELDS.map(({ name, label, autoComplete, hint }) => (
            <div key={name}>
              <label htmlFor={name} className="mb-1 block text-xs font-semibold text-text-secondary">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type="password"
                autoComplete={autoComplete}
                value={form[name]}
                onChange={handleChange}
                aria-invalid={Boolean(errors[name])}
                className={inputClass}
              />
              {errors[name] ? (
                <p className="mt-1 text-xs text-danger">{errors[name]}</p>
              ) : (
                hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>
              )}
            </div>
          ))}

          {apiError && (
            <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="h-10 w-full rounded-xl bg-brand text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong disabled:opacity-60"
          >
            {saving ? "Saving…" : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
