import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSideBar from "../components/DashSideBar";
import DashPost from "../components/DashPost";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    // the same as use search params in react router dom
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="md:w-56">
        <DashSideBar />
      </div>
      {tab === "posts" && <DashPost />}
      {tab === "profile" && <DashProfile />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComments />}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
}

export default Dashboard;
