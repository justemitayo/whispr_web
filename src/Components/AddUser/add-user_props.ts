export interface AddUserProp extends Pick<Auth, 'user'> {
  currentUser: Auth | null;
  setAllUser:  React.Dispatch<React.SetStateAction<boolean>>
}