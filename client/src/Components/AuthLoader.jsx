import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "../slices/authSlice";

function AuthLoader() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await fetch("https://selfless-renewal-production-793e.up.railway.app/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Invalid token");
        const user = await res.json();

        dispatch(setCredentials({ user, token }));
      } catch (err) {
        dispatch(logout()); // clear token & state on failure
      }
    };

    fetchUser();
  }, [token, dispatch]);

  return null; // this component does not render anything
}

export default AuthLoader;
