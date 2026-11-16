import { useAuth } from "@/context/AuthContext";

export function useAuthUser() {
  const auth = useAuth();

  return {
    ...auth,
    isCandidate: auth.user?.role === "candidate",
    isRecruiter: auth.user?.role === "recruiter",
    isAdmin: auth.user?.role === "admin",
  };
}

export default useAuthUser;
