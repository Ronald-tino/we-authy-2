import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";

const AuthLayout = ({ children, queryClient }) => {
  return (
    <div className="auth-layout">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </div>
  );
};

export default AuthLayout;
