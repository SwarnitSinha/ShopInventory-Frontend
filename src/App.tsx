import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/not-found";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import AuthPage from "./pages/auth-page";
import Dashboard from "./pages/dashboard";
import Products from "./pages/products";
import Sales from "./pages/sales";
import Buyers from "./pages/buyers";
import Towns from "./pages/towns";
import React from "react"
import BillGeneratePage from "./pages/bill-generate-page";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/products" component={Products} />
      <ProtectedRoute path="/sales" component={Sales} />
      <ProtectedRoute path="/bill-generate" component={BillGeneratePage} />
      <ProtectedRoute path="/buyers" component={Buyers} />
      <ProtectedRoute path="/towns" component={Towns} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;