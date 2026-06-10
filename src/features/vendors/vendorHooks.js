import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getVendors,
    createVendor,
  } from "./vendorAPI";
  
  export const useGetVendors =
    () => {
      return useQuery({
        queryKey: ["vendors"],
        queryFn: getVendors,
      });
    };
  
  export const useCreateVendor =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn: createVendor,
  
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["vendors"],
          });
        },
      });
    };