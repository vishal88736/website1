import Portfolio from "../portfolio.jsx";
import { MotionSettingsProvider } from "./components/MotionSettings.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";

export default function App() {
  return (
    <MotionSettingsProvider>
      <SmoothScroll>
        <Portfolio />
      </SmoothScroll>
    </MotionSettingsProvider>
  );
}
