// leadHooks.js

import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getLeads,
    createLead,
    updateLead,
  } from "./leadAPI";
  
  // GET LEADS
  export const useGetLeads = () => {
  
    return useQuery({
  
      queryKey: ["leads"],
  
      queryFn: getLeads,
  
      onError: (error) => {
  
        console.log(
          "GET LEADS HOOK ERROR:",
          error
        );
      },
    });
  };
  
  // CREATE LEAD
  export const useCreateLead = () => {
  
    const queryClient = useQueryClient();
  
    return useMutation({
  
      mutationFn: createLead,
  
      onSuccess: (data) => {
  
        console.log(
          "CREATE LEAD SUCCESS:",
          data
        );
  
        queryClient.invalidateQueries({
          queryKey: ["leads"],
        });
      },
  
      onError: (error) => {
  
        console.log(
          "CREATE LEAD HOOK ERROR:",
          error
        );
      },
    });
  };
  
  // UPDATE LEAD
  export const useUpdateLead = () => {
  
    const queryClient = useQueryClient();
  
    return useMutation({
  
      mutationFn: ({ id, data }) => {
  
        return updateLead(id, data);
      },
  
      onSuccess: (data) => {
  
        console.log(
          "UPDATE LEAD SUCCESS:",
          data
        );
  
        queryClient.invalidateQueries({
          queryKey: ["leads"],
        });
      },
  
      onError: (error) => {
  
        console.log(
          "UPDATE LEAD HOOK ERROR:",
          error
        );
      },
    });
  };