import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CContainer } from "@coreui/react";

// routes config
import routes from "../routes";
import SpinnerComponent from "./Spinner";

const AppContent = () => {
  return (
    <CContainer className="px-5" style={{height: "100%"}} lg>
      <Suspense
        fallback={
          <SpinnerComponent style={{ height: "80vh", width: "100%" }} />
        }
      >
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            );
          })}
          <Route path="/" element={<Navigate to="login" replace />} />
          <Route
            path="/botsSettings"
            element={<Navigate to="botsSettings" replace />}
          />
          <Route
            path="/chartsPage"
            element={<Navigate to="chartsPage" replace />}
          />
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
