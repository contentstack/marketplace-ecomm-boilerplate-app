/* Import React modules */
import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundary";
import MarketplaceAppProvider from "../../common/providers/MarketplaceAppProvider";
import EntrySidebarExtensionProvider from "../../common/providers/EntrySidebarExtensionProvider";
import AppConfigurationExtensionProvider from "../../common/providers/AppConfigurationExtensionProvider";
import ProductCustomFieldExtensionProvider from "../../common/providers/ProductCustomFieldExtensionProvider";
import CategoryCustomFieldExtensionProvider from "../../common/providers/CategoryCustomFieldExtensionProvider";
/* Import node module CSS */
import "@contentstack/venus-components/build/main.css";
/* Import our CSS */
import "./styles.scss";
import SelectorExtensionProvider from "../../common/providers/SelectorExtensionProvider";

/** HomeRedirectHandler - component to nandle redirect based on the window location pathname,
    as react Router does not identifies pathname if the app is rendered in an iframe.
*/
const HomeRedirectHandler = function () {
  if (window?.location?.pathname !== "/") {
    return <Navigate to={{ pathname: window.location.pathname }} />;
  }
  return null;
};

/**
 * All the routes are Lazy loaded.
 * This will ensure the bundle contains only the core code and respective route bundle
 * improving the page load time
 */

const AppConfigurationExtension = React.lazy(
  () => import("../ConfigScreen/index")
);
const ProductExtension = React.lazy(() => import("../ProductsField/index"));
const CategoryExtension = React.lazy(() => import("../CategoryField/index"));
const SelectorExtension = React.lazy(() => import("../SelectorPage/index"));
const SidebarExtension = React.lazy(() => import("../SidebarWidget/index"));

function App() {
  return (
    <ErrorBoundary>
      <MarketplaceAppProvider>
        <Routes>
          <Route path="/" element={<HomeRedirectHandler />} />
          <Route
            path="/app-configuration"
            element={
              <Suspense fallback={null}>
                <AppConfigurationExtensionProvider>
                  <AppConfigurationExtension />
                </AppConfigurationExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/product-field"
            element={
              <Suspense fallback={null}>
                <ProductCustomFieldExtensionProvider>
                  <ProductExtension />
                </ProductCustomFieldExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/category-field"
            element={
              <Suspense fallback={null}>
                <CategoryCustomFieldExtensionProvider>
                  <CategoryExtension />
                </CategoryCustomFieldExtensionProvider>
              </Suspense>
            }
          />
          <Route
            path="/sidebar-widget"
            element={
              <Suspense fallback={null}>
                <EntrySidebarExtensionProvider>
                  <SidebarExtension />
                </EntrySidebarExtensionProvider>
              </Suspense>
            }
          />

          <Route
            path="/selector-page"
            element={
              <Suspense fallback={null}>
                <SelectorExtensionProvider>
                  <SelectorExtension />
                </SelectorExtensionProvider>
              </Suspense>
            }
          />
        </Routes>
      </MarketplaceAppProvider>
    </ErrorBoundary>
  );
}

export default App;
