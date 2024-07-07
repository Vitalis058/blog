/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";

function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-100">
        {children}
      </div>
    </div>
  );
}

export default ThemeProvider;
