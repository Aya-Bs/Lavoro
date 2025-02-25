import { signInWithPopup } from "firebase/auth";
import { githubAuth, githubProvider } from "./Firebase"

const GitHubLogin = () => {
  
  const githHubLogin = async () => {
    try {
      const loginResponse = await signInWithPopup(githubAuth, githubProvider);
      console.log(loginResponse);
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <div className="social-container">
      <a href="#" className="social" onClick={githHubLogin}>
        <i className="fab fa-github"></i> 
      </a>
    </div>
  );
};

export default GitHubLogin;
