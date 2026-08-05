import { useNavigate } from "react-router-dom";

export function useAppNavigateBack() {
  const navigate = useNavigate();
  return () => navigate(-1);
}

export function canGoBackState(state) {
  return Boolean(state && typeof state === "object");
}

