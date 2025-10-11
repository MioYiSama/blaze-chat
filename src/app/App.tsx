import ChatPage from "@/app/pages/chat/ChatPage";
import SettingsPage from "@/app/pages/settings/SettingsPage";
import { Route, Router } from "@solidjs/router";
import Root from "./pages/Root";

export default function App() {
  return (
    <Router root={Root}>
      <Route path="/" component={ChatPage} />
      <Route path="/settings" component={SettingsPage} />
    </Router>
  );
}
