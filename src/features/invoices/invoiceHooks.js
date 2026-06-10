import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getInvoices,
    createInvoice,
  } from "./invoiceAPI";
  
  // GET
  export const useGetInvoices =
    () => {
      return useQuery({
        queryKey: ["invoices"],
  
        queryFn: getInvoices,
      });
    };
  
  // CREATE
  export const useCreateInvoice =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn:
          createInvoice,
  
        onSuccess: () => {
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