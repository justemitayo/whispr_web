import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
} from 'react';

export type IAuthProvider = React.FC<{
  children: ReactNode;
}>;

export type IAuthContext = {
  auth: Auth | null;
  setAuth: Dispatch<SetStateAction<Auth | null>>;
};

export const AuthContext = createContext<IAuthContext | null>(null);

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);

  useEffect(function onDidMount() {
    if (!context) {
      console.error('useAuth must have AuthProvider as parent.');
    }
  });

  return context as IAuthContext;
}
