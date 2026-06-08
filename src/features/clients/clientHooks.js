import { useQuery } from "@tanstack/react-query";

import { getClients } from "./clientAPI";

export const useGetClients = () => {
  return useQuery({
    queryKey: ["clients"],

    queryFn: getClients,

    onError: (error) => {
      console.log(
        "GET CLIENTS HOOK ERROR:",
        error
      );
    },
  });
};