import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import {
  Link,
  useLocation,
  NavLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { FaMoon } from "react-icons/fa";
import { toggleTheme } from "../redux/theme/themeSlice";
import { CiSun } from "react-icons/ci";
import { failed, success } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { infoNotification } from "../utils/info";

function Header() {
  //used to indentify the current active path
  const [searchParams] = useSearchParams();
  // const location = useLocation().search;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  //search functionality
  useEffect(
    function () {
      const searchTermFromUrl = searchParams.get("searchTerm");
      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
      }
    },
    [searchParams],
  );

  // search function
  function handleSubmit(e) {
    e.preventDefault();

    if (searchTerm) {
      navigate(`search?searchTerm=${searchTerm}`);
      setSearchTerm("");
    } else {
      infoNotification(theme, "no query or the query is too short");
    }
  }

  // sign out functionality
  async function handleSignOut() {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "post",
      });
      const data = await res.json();
      if (data.success === true) {
        dispatch(success(null));
      }
    } catch (error) {
      dispatch(failed(error.message));
    }
  }

  return (
    <Navbar className="sticky top-0 z-50 border-b-2">
      <Link to="/">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/mern-blog-2e34f.appspot.com/o/logo%2Flogo-5-02.png?alt=media&token=784f9da5-d569-41b8-bdc0-559ffd55928c"
          className="w-24"
        />
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          sizing="sm"
          placeholder="search.."
          rightIcon={IoSearchOutline}
          className="hidden w-60 sm:block "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        ></TextInput>
      </form>
      <Button className="h-9 w-12 sm:hidden" color="gray" pill>
        <IoSearchOutline />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="hidden h-10 w-12 sm:inline"
          onClick={() => dispatch(toggleTheme())}
          pill
          color={theme}
        >
          {theme === "light" ? (
            <FaMoon />
          ) : (
            <CiSun className="dark: text-xl text-slate-100 " />
          )}{" "}
        </Button>
        {currentUser ? (
          <Dropdown
            className="object-cover"
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.photoUrl} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block truncate text-sm font-medium">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => handleSignOut()}>
                Sign Out
              </Dropdown.Item>
            </Link>
          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button className="bg-[#41A1D7]" outline pill>
              Sign In
            </Button>
          </Link>
        )}

        {/* the nav toggle works together with the nav collapse below */}
        <Navbar.Toggle />
      </div>
      {/* used to create a collapsable menu */}
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <NavLink to="/">Home</NavLink>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <NavLink to="/about">About</NavLink>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <NavLink to="/projects">Projects</NavLink>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
