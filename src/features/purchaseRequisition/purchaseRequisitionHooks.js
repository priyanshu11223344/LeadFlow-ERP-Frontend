import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getPurchaseRequisitions,
    updatePurchaseRequisition,
  } from "./purchaseRequisitionAPI";
  
  export const
    useGetPurchaseRequisitions =
    () => {
      return useQuery({
        queryKey: [
          "purchaseRequisitions",
        ],
  
        queryFn:
          getPurchaseRequisitions,
      });
    };
  
  export const
    useUpdatePurchaseRequisition =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn: ({
          id,
          data,
        }) =>
          updatePurchaseRequisition(
            id,
            data
          ),
  
        onSuccess: () => {
          queryClient.invalidateQueries(
            {
              queryKey: [
                "purchaseRequisitions",
              ],
            }
          );
        },
      });
    };