import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getPayments,
    createPayment,
  } from "./paymentAPI";
  
  // GET
  export const useGetPayments =
    () => {
      return useQuery({
        queryKey: ["payments"],
        queryFn: getPayments,
      });
    };
  
  // CREATE
  export const useCreatePayment =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn:
          createPayment,
  
        onSuccess: () => {
          queryClient.invalidateQueries(
            {
              queryKey: [
                "payments",
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