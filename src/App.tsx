import { Route, Router } from "@solidjs/router";
import ChatPage from "./routes/ChatPage";
import RootLayout from "./routes/RootLayout";
import SettingsPage from "./routes/SettingsPage";

export default function App() {
  return (
    <Router root={RootLayout}>
      <Route path="/" component={ChatPage} />
      <Route path="/settings" component={SettingsPage} />
    </Router>
  );
}
