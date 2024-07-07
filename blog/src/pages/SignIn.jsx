import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { success, start, failed } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import { errorNotification } from "../utils/error";
import { infoNotification } from "../utils/info";

function SignIn() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error: errorMessage } = useSelector((state) => state.user);

  const { theme } = useSelector((state) => state.theme);

  // getting the data from the form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      infoNotification(theme, "all fields are required");
      return dispatch(failed());
    }

    // dont forget to set the proxy in the vite config
    // sending the data back to our api backend
    try {
      dispatch(start());
      const res = await fetch("/api/auth/signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // the response that we will be recieving from the back end
      const data = await res.json();
      if (data.success === false) {
        errorNotification(theme, data.message);
        dispatch(failed());
        return;
      }

      //navigating to the login page
      if (data.success === true) {
        dispatch(success(data.newUser));
        navigate("/");
        return;
      }
    } catch (error) {
      errorNotification(theme, error.message);
      dispatch(failed());
    }
  };

  return (
    <div className="min-h-svh sm:mt-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 p-3 md:flex-row md:items-center ">
        {/* left side of the sreen */}
        <div className="flex-1">
          <Link to="/" className=" text-4xl font-bold dark:text-white">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/mern-blog-2e34f.appspot.com/o/logo%2Flogo-5-02.png?alt=media&token=784f9da5-d569-41b8-bdc0-559ffd55928c"
              alt="spence-logo"
              className="mx-auto w-80"
            />
          </Link>
          <p className="mt-5 hidden text-center md:inline-block">
            this is a demo project you can login with your email and password or
            with google
          </p>
        </div>

        {/* right side of the screen */}

        <div className="flex-1">
          {/* displaying the error alert */}
          {errorMessage && (
            <Alert className="" color="failure">
              {errorMessage}
            </Alert>
            // <ToastContainer />
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" />
              <TextInput
                type="Email"
                placeholder="Email@gmail.com"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>

            <Button className="bg-[#41A1D7]" type="submit" disabled={isLoading}>
              {" "}
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Submitting..</span>
                </>
              ) : (
                "Login"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="mt-5 flex gap-2 text-sm">
            <span>New to Vitalis Blog</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
