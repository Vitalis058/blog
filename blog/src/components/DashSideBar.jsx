import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { failed, success } from "../redux/user/userSlice";
import { HiDocumentText } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { LuUsers2 } from "react-icons/lu";
import { FaRegCommentDots } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";

function DashSideBAr() {
  // get the location then navigate to the location acquired from the url
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // sign out function
  async function handleSignOut() {
    try {
      const res = await fetch("api/auth/signout", {
        method: "post",
      });
      const data = await res.json();
      if (data.success === true) {
        dispatch(success(null));
      }
    } catch (error) {
      console.log(error);
      dispatch(failed());
    }
  }

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={FaUserCircle}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=dash">
                <Sidebar.Item
                  active={tab === "dash"}
                  icon={MdOutlineDashboard}
                  as="div"
                >
                  Dashboard
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  as="div"
                >
                  posts
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=users">
                <Sidebar.Item active={tab === "users"} icon={LuUsers2} as="div">
                  users
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={FaRegCommentDots}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            className="cursor-pointer"
            icon={FaSignOutAlt}
            onClick={() => handleSignOut()}
          >
            sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSideBAr;
