/* Import React modules */
import React from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
/* Import other node modules */
/* Import our modules */
import ErrorBoundary from "../../components/ErrorBoundary";
import ConfigScreen from "../ConfigScreen";
import SelectorPage from "../SelectorPage";
import ProductField from "../ProductsField";
import CategoryField from "../CategoryField";
import SidebarWidget from "../SidebarWidget";

/* Import node module CSS */
import "@contentstack/venus-components/build/main.css";
/* Import our CSS */
import "./styles.scss";

/** HomeRedirectHandler - component to nandle redirect based on the window location pathname,
    as react Router does not identifies pathname if the app is rendered in an iframe.
*/
const HomeRedirectHandler = function () {
  if (window?.location?.pathname !== "/") {
    return <Navigate to={{ pathname: window.location.pathname }} />;
  }
  return null;
};

/* App - The main app component that should be rendered */
const App: React.FC = function () {
  return (
    <div className="app">
      <ErrorBoundary>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomeRedirectHandler />} />
            <Route path="/config" element={<ConfigScreen />} />
            <Route path="/product-field" element={<ProductField />} />
            <Route path="/category-field" element={<CategoryField />} />
            <Route path="/sidebar-widget" element={<SidebarWidget />} />
            <Route path="/selector-page" element={<SelectorPage />} />
          </Routes>
        </HashRouter>
      </ErrorBoundary>
    </div>)
};

export default App;
