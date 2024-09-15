import AuthProvider from "@/contexts/auth.context";
import QueryProvider from "@/providers/query.provider";
import { PropsWithChildren } from "react";

function ProviderLayout({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}

export default ProviderLayout;
