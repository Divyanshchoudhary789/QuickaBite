import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./routes/ScrollToTop";
import App from "./App.jsx";

// Temporarily keep existing App logic while enabling router context.
export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  );
}
