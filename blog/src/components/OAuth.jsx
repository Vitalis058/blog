import { Button } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { success } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const navigate = useNavigate(); // automatic navigatioon
  const dispatch = useDispatch(); // to dispatch action to the global redux toolkit

  // handle sign up by google
  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    // the google pop up
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      // ggetting the user credentials from the google account and creating a user object
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success === true) {
        dispatch(success(data.user));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      type="button"
      className="bg-[#41A1D7]"
      outline
      onClick={handleGoogleClick}
    >
      <FcGoogle className="mr-3 h-6 w-6" />
      continue with Google
    </Button>
  );
}

export default OAuth;
