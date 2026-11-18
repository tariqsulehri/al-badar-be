import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createNotification } from "../../helpers/notificationsHepler";
import { setCredentials } from "../../features/auth/slice/authSlice";
import LoginForm from "../../features/auth/login.form";
import { login } from "../../services/apis/authService";
import { errorMessage } from "../../services/axios";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ username, password }) => {
    setLoading(true);
    try {
      const { token, user } = await login({ username, password });
      dispatch(setCredentials({ token, user }));
      createNotification("success", `Welcome ${user.username}!`);
      const home = ["admin", "manager"].includes(user.role) ? "/dashboard" : "/";
      navigate(location.state?.from || home, { replace: true });
    } catch (error) {
      createNotification("error", errorMessage(error, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-page__panel">
        <div className="login-page__content">
          <span className="page-header__eyebrow">Welcome Back</span>
          <h1>Professional media operations, now with a cleaner experience.</h1>
          <p>
            Sign in to manage slides, configuration data, parties, and user workflows
            from a more modern control center.
          </p>

          <div className="login-page__highlights">
            <div className="login-page__highlight">
              <strong>Modern shell</strong>
              <span>Upgraded navigation, spacing, and visual rhythm.</span>
            </div>
            <div className="login-page__highlight">
              <strong>Faster scanning</strong>
              <span>Sharper hierarchy for day-to-day operations.</span>
            </div>
            <div className="login-page__highlight">
              <strong>Ready for growth</strong>
              <span>A stronger base for future feature design.</span>
            </div>
          </div>
        </div>

        <div className="login-page__card page-card">
          <div className="login-page__card-header">
            <h2>Sign in</h2>
            <p>Use your account to access the workspace.</p>
          </div>
          <LoginForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </section>
  );
};

export default Login;
