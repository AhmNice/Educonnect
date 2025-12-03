import { useAuthStore} from "../store/authStore"
export const resetAuthState = () => {
  useAuthStore.setState({
    user: null,
    loadingUser: false,
    checkingAuth: false,
  });
};