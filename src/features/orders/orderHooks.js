import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getOrders,
    createOrder,
  } from "./orderAPI";
  
  export const useGetOrders =
    () => {
      return useQuery({
        queryKey: ["orders"],
  
        queryFn: getOrders,
      });
    };
  
  export const useCreateOrder =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn: createOrder,
  
        onSuccess: () => {
          queryClient.invalidateQueries(
            {
              queryKey: ["orders"],
            }
          );
  
          queryClient.invalidateQueries(
            {
              queryKey: [
                "inventory",
              ],
            }
          );
        },
      });
    };