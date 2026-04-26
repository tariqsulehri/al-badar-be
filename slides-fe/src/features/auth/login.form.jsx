import { Formik } from "formik";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { TextFieldFormik } from "../../components/form-controls/input/text.field.formik";
import Loader from "../../components/common/loader/loader.spinner";
import schema from "./loginValidations";
import "./login.css";

const LoginForm = (props) => {
  const { loading = false } = props;
  const initialValues = {
    username: "",
    password: "",
  };

  const onForgotPassword = (values, setFieldTouched) => {
    setFieldTouched("password", false);
    toast.dismiss();
    if (values.username) {
      props.onForgotPassword && props.onForgotPassword(values);
    } else {
      setFieldTouched("username", true, true);
    }
  };

  const onSubmit = (values) => {
    toast.dismiss();
    props.onSubmit(values);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
      {({
        handleSubmit,
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldTouched,
      }) => {
        const inputProps = {
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldTouched,
        };

        return (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form__field">
              <TextFieldFormik
                name="username"
                id="username"
                disabled={loading}
                placeholder="admin"
                labelClassName="labelfield"
                label="Username"
                {...inputProps}
              />
            </div>

            <div className="auth-form__field">
              <TextFieldFormik
                name="password"
                id="password"
                type="password"
                disabled={loading}
                placeholder="admin"
                labelClassName="labelfield"
                label="Password"
                {...inputProps}
              />
            </div>

            <button type="submit" id="LoginBtn" className="btn btn-primary auth-form__submit">
              {loading ? <Loader size={28} role="status" className="spinner-border" /> : "Sign in"}
            </button>

            <div className="auth-form__assist">
              <span>Forgot password?</span>
              <button
                type="button"
                className="auth-form__link"
                onClick={() => onForgotPassword(values, setFieldTouched)}
              >
                Start recovery
              </button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

LoginForm.propTypes = {
  onForgotPassword: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default LoginForm;
