import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const useColorTheme = () => {
  const { theme } = useContext(ThemeContext);
  return theme;
};

export default useColorTheme;
