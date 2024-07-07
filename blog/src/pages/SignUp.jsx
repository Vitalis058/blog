import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // getting the data from the form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("fill out all fields");
    }

    // dont forget to set the proxy in the vite config
    // sending the data back to our api backend
    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/signup", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // the response that we will be recieving from the back end
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
      }
      setLoading(false);

      //navigating to the login page
      if (res.ok) {
        return navigate("/signin");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh sm:mt-20">
      <div className="mx-auto flex max-w-3xl flex-col  gap-5 p-3 md:flex-row md:items-center">
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
            this is a demo project you can sign up with your email and password
            or with google
          </p>
        </div>

        {/* right side of the screen */}

        <div className="flex-1">
          {/* displaying the error alert */}
          {errorMessage && (
            <Alert className="" color="failure">
              {errorMessage}
            </Alert>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
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

            <Button type="submit" className="bg-[#41A1D7]" disabled={loading}>
              {" "}
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Submitting..</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="mt-5 flex gap-2 text-sm">
            <span>Have an account ?</span>
            <Link to="/signin" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
