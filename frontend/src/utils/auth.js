import { auth } from '../config/firebase';

export const getAuthToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return null;
  }
  return await currentUser.getIdToken();
};
