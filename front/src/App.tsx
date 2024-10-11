import styles from "./App.module.css";
import Routing from "./components/Routing/Routing";
import { AuthProvider } from "./context/AuthProvider";
import { SnackbarProvider } from "./context/SnackbarProvider";

function App() {
  return (
    <div className={styles.app}>
      <SnackbarProvider>
        <AuthProvider>
          <Routing />
        </AuthProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
