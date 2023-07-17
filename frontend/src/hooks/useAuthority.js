import { useSelector } from 'react-redux';

export function useAuthority(authority) {
  const authentication = useSelector((state) => state.authentication.value);
  const { userAuthorites } = authentication.user;
  return userAuthorites.includes(authority);
}
