// a route for only the admins
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser?.isAdmin ? <Outlet /> : <Navigate to="/" />;
}

export default OnlyAdminPrivateRoute;
