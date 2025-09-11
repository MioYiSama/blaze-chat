import { redirect, Route, Router, useNavigate } from "@solidjs/router";
import RootLayout from "./routes/RootLayout";
import ChatPage from "./routes/ChatPage";
import SettingsPage from "./routes/SettingsPage";
import Redirect from "./components/Redirect";

export default function App() {
  return (
    <Router root={RootLayout}>
      <Route path="/" component={Redirect("/chat")} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/settings" component={SettingsPage} />
    </Router>
  );
}
