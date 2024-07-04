import logo from "./Logo.png";
import "./App.css";

export const Connected = () => {
  return (
    <div className="App">
      <div className="top-bar">
        <span className="top-bar-text">eLock</span>
      </div>
      <header className="App-header">
        <div className="content">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="auth-message">
            <h1 className="Home-message">
              Bienvenue dans votre espace utilisateur
            </h1>
          </div>
          <div className="Success-message1">
            Authentification éffectué avec succès !
          </div>
        </div>
      </header>
    </div>
  );
};
