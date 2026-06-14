import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getQuotations,
    createQuotation,
    updateQuotationStatus,
    convertQuotation,
    downloadQuotationPdf
  } from "./quotationAPI";
  
  // GET
  
  export const useGetQuotations =
    () => {
      return useQuery({
        queryKey: [
          "quotations",
        ],
  
        queryFn:
          getQuotations,
      });
    };
  
  // CREATE
  
  export const useCreateQuotation =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn:
          createQuotation,
  
        onSuccess: () => {
          queryClient.invalidateQueries(
            {
              queryKey: [
                "quotations",
              ],
            }
          );
        },
      });
    };
  
  // UPDATE STATUS
  
  export const useUpdateQuotationStatus =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn:
          updateQuotationStatus,
  
        onSuccess: () => {
          queryClient.invalidateQueries(
            {
              queryKey: [
                "quotations",
              ],
            }
          );
        },
      });
    };
  
  // CONVERT
  
  export const useConvertQuotation =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn:
          convertQuotation,
  
        onSuccess: () => {
          queryClient.invalidateQueries(
            {
              queryKey: [
                "quotations",
              ],
            }
          );
  
          queryClient.invalidateQueries(
            {
              queryKey: [
                "deals",
              ],
            }
          );
        },
      });
    };
    export const useDownloadQuotationPdf =
    () => {
      return useMutation({
        mutationFn:
          downloadQuotationPdf,
      });
    };