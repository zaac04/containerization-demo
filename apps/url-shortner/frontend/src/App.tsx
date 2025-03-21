import RedirectForm from "./components/redirect-form";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RedirectForm />
    </ThemeProvider>
  );
}

export default App;
