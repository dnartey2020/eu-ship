import { useQuery } from "@tanstack/react-query";

const getUser = async () => {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return null;

  return res.json();
};

export const useGetUser = () => {
  return useQuery({
    queryFn: getUser,
    queryKey: [""],
  });
};
