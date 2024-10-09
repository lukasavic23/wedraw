import { useEffect } from "react";
import LoginService from "../../services/LoginService";
import { useAuthContext } from "../../context/AuthProvider";

const Welcome = () => {
  const { auth, setAuth } = useAuthContext();

  useEffect(() => {
    LoginService.getUser().then((response) => {
      console.log(response.data);
    });
  }, []);

  return <div>Welcome</div>;
};

export default Welcome;
