import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const infoNotification = (theme, message) => {
  toast.info(`${message}`, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: `${theme}`,
    transition: Bounce,
  });
};
