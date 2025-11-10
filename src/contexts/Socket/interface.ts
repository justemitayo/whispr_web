import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
} from 'react';
import { Socket } from 'socket.io-client';

export type ISocketProvider = React.FC<{
  children: ReactNode;
}>;
 
export type ISocketContext = {
  socket: Socket | null;
  setSocket: Dispatch<SetStateAction<Socket | null>>;
};

export const SocketContext = createContext<ISocketContext | null>(null);

export function useSocket(): ISocketContext {
  const context = useContext(SocketContext);

  useEffect(function onDidMount() {
    if (!context) {
      console.error('useSocket must have SocketProvider as parent.');
    }
  });

  return context as ISocketContext;
}
