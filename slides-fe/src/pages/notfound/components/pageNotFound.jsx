import { useNavigate } from "react-router-dom";
import { useIsLoggedIn } from "../../../utils/utilAuth";

function PageNotFound() {
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();

  return (
    <div className="flex justify-center pt-16">
      <div className="w-full max-w-md rounded-2xl border border-border-soft bg-bg-surface p-8 text-center shadow-soft">
        <p className="text-5xl font-extrabold tracking-tight text-brand">404</p>
        <h1 className="mt-3 text-xl font-bold text-text-primary">Page not found</h1>
        <p className="mt-2 text-sm text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-9 rounded-lg border border-border-soft bg-bg-surface-strong px-3.5 text-[13px] font-medium text-text-primary transition-colors hover:border-brand"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
            className="h-9 rounded-lg bg-brand px-3.5 text-[13px] font-medium text-on-brand transition-colors hover:bg-brand-strong"
          >
            {isLoggedIn ? "Go to dashboard" : "Go home"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
