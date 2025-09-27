import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

export default function App() {
  return (
    <Router root={lazy(() => import("@/app/pages/Root"))}>
      <Route
        path="/"
        component={lazy(() => import("@/app/pages/chat/ChatPage"))}
      />
      <Route
        path="/settings"
        component={lazy(() => import("@/app/pages/settings/SettingsPage"))}
      />
    </Router>
  );
}
