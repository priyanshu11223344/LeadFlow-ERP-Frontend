import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getOrders,
    createOrder,
    updateOrder,
    getOrderById,
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
                "invoices",
              ],
            }
          );
        },
      });
    };

  export const useUpdateOrder =
    () => {
      const queryClient =
        useQueryClient();

      return useMutation({
        mutationFn:
          updateOrder,

        onSuccess: () => {
          [
            "orders",
            "inventory",
            "purchaseRequisitions",
            "invoices",
          ].forEach((queryKey) =>
            queryClient.invalidateQueries({
              queryKey: [queryKey],
            })
          );
        },
      });
    };

    export const useGetOrderById = (
      id
    ) => {
      return useQuery({
        queryKey: ["order", id],
    
        queryFn: () =>
          getOrderById(id),
    
        enabled: !!id,
      });
    };
