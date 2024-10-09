import styles from "./App.module.css";
import Routing from "./components/Routing/Routing";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <div className={styles.app}>
      <AuthProvider>
        <Routing />
      </AuthProvider>
    </div>
  );
}

export default App;
