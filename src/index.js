import React, { useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { KeycloakProvider, useKeycloak } from "keycloak-react-web";
import keycloakConfig from './keycloak-config'; // Import Keycloak config

// Declare PrivateRoute BEFORE root.render()
const PrivateRoute = ({ component: Component }) => {
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login(); // Trigger login if not authenticated
    }
  }, [initialized, keycloak]);

  if (!initialized) {
    return <p>Loading...</p>; // Show loading while Keycloak initializes
  }

  if (!keycloak.authenticated) {
    return <p>Authenticating...</p>; // Show authenticating if Keycloak is not authenticated
  }

  return <Component />; // Render the protected component when authenticated
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <KeycloakProvider client={keycloakConfig}> {/* Pass the correct Keycloak instance */}
    <Router>
      <Routes>
        <Route
          path={'/'}
          element={<PrivateRoute component={App} />}
        />
      </Routes>
    </Router>
  </KeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
