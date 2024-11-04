"use client";

import { getUser } from "@/apis/auth.api";
import supabase from "@/supabase/client";
import { UserRow } from "@/types/database";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type UserDataProps = {
  userData: UserRow | undefined | null;
  isPending?: boolean;
};
interface AuthContextValue extends UserDataProps {
  isInitialized: boolean;
  isLoggedIn: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth는 AuthProvider 안에 있는 곳에서 사용되어야 합니다."
    );
  }
  return context;
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const isLoggedIn = !!user;

  // user 상태 관리
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === "INITIAL_SESSION") {
          // 초기 세션 상태를 처리
          setUser(session?.user || null);
        } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          // 사용자가 로그인과 업데이트를 했을 때 처리
          setUser(session!.user);
        } else if (event === "SIGNED_OUT") {
          // 사용자가 로그아웃했을때
          setUser(null);
        } else if (event === "PASSWORD_RECOVERY") {
          // 비밀번호 복구 이벤트
        } else if (event === "TOKEN_REFRESHED") {
          // 토큰이 갱신되었을 때 처리
        }

        setIsInitialized(true);
      }
    );
  }, []);

  const { isPending, data: userData } = useQuery({
    queryKey: ["userData", user?.id],
    queryFn: () => {
      if (user) {
        return getUser(user.id);
      }
    },
    enabled: isInitialized,
  });

  const value = {
    isInitialized,
    isLoggedIn,
    user,
    setUser,
    userData,
    isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
