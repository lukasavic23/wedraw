import styles from "./App.module.css";
import Login from "./containers/Login/Login";

function App() {
  return (
    <div className={styles.app}>
      <Login></Login>
    </div>
  );
}

export default App;
