import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNotification } from "../../helpers/notificationsHepler";
import { setCurrentUser } from "../../features/auth/slice/authSlice";
import LoginForm from "../../features/auth/login.form";
import { login } from "../../services/apis/authService";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const assignRole = (user) => {
    if (user.toLowerCase() === "admin") {
      return "admin";
    }
    return "user";
  };

  const loginSuccess = (username) => {
    dispatch(
      setCurrentUser({
        name: username,
        role: assignRole(username),
        token: "112324gg12444&&&&##",
      })
    );

    createNotification("success", `Welcome ${username}!`);
    navigate("/");
  };

  const handleSubmit = async ({ username, password }) => {
    try {
      const loggedUser = await login({ username, password });
      if (loggedUser?.username) {
        loginSuccess(loggedUser.username);
      } else {
        createNotification("error", "Invalid credentials");
      }
    } catch (error) {
      createNotification("error", error.message || "Login failed");
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
          <LoginForm onSubmit={handleSubmit} />
        </div>
      </div>
    </section>
  );
};

export default Login;
