import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, Spin } from "antd";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useKeycloak } from "./auth/useKeycloak";
import { PersonCard } from "./pages/PersonCard";
import { PersonList } from "./pages/PersonList";
import { DocumentCard } from "./pages/DocumentCard";
import { AdressDetails } from "./pages/AdressDetails";
import { KeycloakHandler } from "./components/KeycloakHandler";
import "./App.css";

function AppContent() {
  const { initialized } = useKeycloak();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialized) {
      setLoading(false);
    }
  }, [initialized]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <Spin size="large"></Spin>
          Просим у keycloack разрешения
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <KeycloakHandler />
      <Routes>
        <Route path="/person/:id" element={<PersonCard />} />
        <Route path="/document/:id" element={<DocumentCard />} />
        <Route path="/address/:id" element={<AdressDetails />} />
        <Route path="/persons" element={<PersonList />} />
        <Route path="/" element={<PersonList />} />
        <Route
          path="*"
          element={
            <div style={{ padding: 20, textAlign: "center" }}>
              <h2>Страница не найдена</h2>
              <p>Запрашиваемая страница не существует.</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
