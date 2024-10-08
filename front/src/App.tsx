import styles from "./App.module.css";
import Routing from "./components/Routing/Routing";

function App() {
  return (
    <div className={styles.app}>
      <Routing />
    </div>
  );
}

export default App;
