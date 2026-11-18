import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsLoggedIn } from "../features/auth/slice/authSlice";

export const useIsLoggedIn = () => useSelector(selectIsLoggedIn);

export const useCurrentUser = () => useSelector(selectCurrentUser);
