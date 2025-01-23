import AuthProvider from "@/contexts/auth.context";
import QueryProvider from "@/providers/query.provider";
import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";

function ProviderLayout({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </QueryProvider>
  );
}

export default ProviderLayout;
