import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getDispatches,
    createDispatch,
  } from "./dispatchAPI";
  
  export const useGetDispatches =
    () => {
      return useQuery({
        queryKey: ["dispatches"],
  
        queryFn: getDispatches,
      });
    };
  
  export const useCreateDispatch =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn: createDispatch,
  
        onSuccess: () => {
          queryClient.invalidateQueries(
            {
              queryKey: [
                "dispatches",
              ],
            }
          );
  
          queryClient.invalidateQueries(
            {
              queryKey: [
                "orders",
              ],
            }
          );
        },
      });
    };