import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getVendorPurchaseOrders,
    createVendorPurchaseOrder,
  } from "./vendorPurchaseOrderAPI";
  
  export const useGetVendorPurchaseOrders =
    () => {
      return useQuery({
        queryKey: [
          "vendorPurchaseOrders",
        ],
        queryFn:
          getVendorPurchaseOrders,
      });
    };
  
  export const useCreateVendorPurchaseOrder =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn:
          createVendorPurchaseOrder,
  
        onSuccess: () => {
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