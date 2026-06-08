import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { getDeals,getDealById,createDeal,updateDeal,deleteDeal } from "./dealAPI";

//GET ALL DEALS
export const useGetDeals=()=>{
    return useQuery({
        queryKey:["deals"],
        queryFn:getDeals,
        onError:(error)=>{
            console.log(
                "GET DEALS HOOK ERROR:",error
            )
        }
    })
};
// GET SINGLE DEAL
export const useGetDealById = (id) => {

    return useQuery({
  
      queryKey: ["deal", id],
  
      queryFn: () => getDealById(id),
  
      enabled: !!id,
  
      onError: (error) => {
  
        console.log(
          "GET DEAL BY ID HOOK ERROR:",
          error
        );
      },
    });
  };

// CREATE DEAL
export const useCreateDeal=()=>{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:createDeal,
        onSuccess:(data)=>{
            console.log(
                "CREATE DEAL SUCCESS",
                data
            );
            queryClient.invalidateQueries({
                queryKey:["deals"],
            })
            queryClient.invalidateQueries({
                queryKey:["leads"],
            })
        },
        onError:(error)=>{
            console.log(
                "CREATE DEAL HOOK ERROR:",
                error
            )
        }
    })
}
// UPDATE DEAL
export const useUpdateDeal = () => {

    const queryClient = useQueryClient();
  
    return useMutation({
  
      mutationFn: ({ id, data }) =>
        updateDeal(id, data),
  
      onSuccess: (data) => {
  
        console.log(
          "UPDATE DEAL SUCCESS:",
          data
        );
  
        queryClient.invalidateQueries({
          queryKey: ["deals"],
        });
      },
  
      onError: (error) => {
  
        console.log(
          "UPDATE DEAL HOOK ERROR:",
          error
        );
      },
    });
  };
  
  // DELETE DEAL
  export const useDeleteDeal = () => {
  
    const queryClient = useQueryClient();
  
    return useMutation({
  
      mutationFn: deleteDeal,
  
      onSuccess: (data) => {
  
        console.log(
          "DELETE DEAL SUCCESS:",
          data
        );
  
        queryClient.invalidateQueries({
          queryKey: ["deals"],
        });
  
        queryClient.invalidateQueries({
          queryKey: ["leads"],
        });
      },
  
      onError: (error) => {
  
        console.log(
          "DELETE DEAL HOOK ERROR:",
          error
        );
      },
    });
  };