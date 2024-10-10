import { useAuthContext } from "../../context/AuthProvider";
import AuthenticationService from "../../services/AuthenticationService";

const Welcome = () => {
  const { auth, setAuth } = useAuthContext();

  const handleLogout = () => {
    AuthenticationService.logout()
      .then(() => {
        setAuth(null);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      Welcome {auth?.name} {auth?.lastName}
      <button onClick={handleLogout}>LOG OUT!</button>
    </div>
  );
};

export default Welcome;
