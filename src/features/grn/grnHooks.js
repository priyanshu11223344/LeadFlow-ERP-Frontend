import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getGRNs,
    createGRN,
  } from "./grnAPI";
  
  export const useGetGRNs =
    () => {
      return useQuery({
        queryKey: ["grns"],
        queryFn: getGRNs,
      });
    };
  
  export const useCreateGRN =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn: createGRN,
  
        onSuccess: () => {
          queryClient.invalidateQueries(
            {
              queryKey: ["grns"],
            }
          );
  
          queryClient.invalidateQueries(
            {
              queryKey: [
                "inventory",
              ],
            }
          );
  
          queryClient.invalidateQueries(
            {
              queryKey: [
                "purchaseRequisitions",
              ],
            }
          );
  
          queryClient.invalidateQueries(
            {
              queryKey: [
                "vendorPurchaseOrders",
              ],
            }
          );
        },
      });
    };