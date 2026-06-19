import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getInvoices,
    createInvoice,
    downloadInvoicePdf,
  } from "./invoiceAPI";
  
  // GET
  export const useGetInvoices =
    () => {
      return useQuery({
        queryKey: ["invoices"],
  
        queryFn: getInvoices,
      });
    };

  export const useDownloadInvoicePdf =
    () => {
      return useMutation({
        mutationFn:
          downloadInvoicePdf,
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
