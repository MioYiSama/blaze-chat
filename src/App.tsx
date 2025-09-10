import { Route, Router } from "@solidjs/router";
import RootLayout from "./routes/RootLayout";

export default function App() {
  return (
    <Router root={RootLayout}>
      <Route path="/" component={() => <p>Home</p>} />
    </Router>
  );
}
