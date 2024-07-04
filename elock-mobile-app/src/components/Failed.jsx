import logo from "./Logo.png";
import "./App.css";
export const Failed = () => {
  return (
    <div className="App">
      <div className="top-bar">
        <span className="top-bar-text">eLock</span>
      </div>
      <header className="App-header">
        <div className="content">
          <img src={logo} className="App-logo_failed" alt="logo" />
          <div className="Failed-message">Authentification échouée !</div>
        </div>
      </header>
    </div>
  );
};
