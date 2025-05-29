import React, { useEffect, useState } from 'react';
import { AuthContext, IAuthProvider } from './interface';
import { useAuthStore } from '../../store/auth.store';

export const AuthProvider: IAuthProvider = function AuthProvider({ children }) {
  const authStat = useAuthStore().auth;

  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    setAuth(authStat);
  }, [authStat]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth, 
      }}>
      {children}
    </AuthContext.Provider>
  );
};









// import React from 'react';
// import { food_list } from '../Demo/Demo';
// import { useStore } from '../store/StoreContextProvider';

// const ProductList = () => {
//   const { addToCart, removeFromCart, cartItem } = useStore();


//   import React, {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//     ReactNode,
//     FC,
//   } from 'react';
//   import { food_list } from '../Demo/Demo';
//   import { FoodItem } from './types'; // You should define the type of a food item here
  
//   // --------------------
//   // Types
//   // --------------------
//   interface StoreContextType {
//     cartItem: Record<string, number>;
//     likeItem: Record<string, number>;
//     addToCart: (termId: string) => void;
//     removeFromCart: (termId: string) => void;
//     addToLike: (termId: string) => void;
//     removeFromLike: (termId: string) => void;
//     getTotalCart: () => number;
//   }
  
//   export const StoreContext = createContext<StoreContextType | null>(null);
  
//   export const useStore = (): StoreContextType => {
//     const context = useContext(StoreContext);
//     if (!context) {
//       throw new Error('useStore must be used within a StoreContextProvider');
//     }
//     return context;
//   };
  
//   // --------------------
//   // Provider
//   // --------------------
//   export const StoreContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
//     const [cartItem, setCartItem] = useState<Record<string, number>>({});
//     const [likeItem, setLikeItem] = useState<Record<string, number>>({});
  
//     const addToCart = (termId: string) => {
//       setCartItem(prev => ({
//         ...prev,
//         [termId]: (prev[termId] || 0) + 1,
//       }));
//     };
  
//     const removeFromCart = (termId: string) => {
//       setCartItem(prev => ({
//         ...prev,
//         [termId]: Math.max((prev[termId] || 0) - 1, 0),
//       }));
//     };
  
//     const addToLike = (termId: string) => {
//       setLikeItem(prev => ({
//         ...prev,
//         [termId]: (prev[termId] || 0) + 1,
//       }));
//     };
  
//     const removeFromLike = (termId: string) => {
//       setLikeItem(prev => ({
//         ...prev,
//         [termId]: Math.max((prev[termId] || 0) - 1, 0),
//       }));
//     };
  
//     const getTotalCart = (): number => {
//       let total = 0;
//       for (const termId in cartItem) {
//         const quantity = cartItem[termId];
//         if (quantity > 0) {
//           const item = food_list.find((f: FoodItem) => f._id === termId);
//           if (item) total += item.price * quantity;
//         }
//       }
//       return total;
//     };
  
//     useEffect(() => {
//       console.log('Cart:', cartItem);
//       console.log('Liked:', likeItem);
//     }, [cartItem, likeItem]);
  
//     const contextValue: StoreContextType = {
//       cartItem,
//       likeItem,
//       addToCart,
//       removeFromCart,
//       addToLike,
//       removeFromLike,
//       getTotalCart,
//     };
  
//     return (
//       <StoreContext.Provider value={contextValue}>
//         {children}
//       </StoreContext.Provider>
//     );
//   };
  