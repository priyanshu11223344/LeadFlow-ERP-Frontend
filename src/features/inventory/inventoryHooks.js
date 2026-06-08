import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    getInventory,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory,
  } from "./inventoryAPI";
  
  // GET ALL INVENTORY
  export const useGetInventory =
    () => {
      return useQuery({
        queryKey: ["inventory"],
  
        queryFn: getInventory,
  
        onError: (error) => {
          console.log(
            "GET INVENTORY HOOK ERROR:",
            error
          );
        },
      });
    };
  
  // GET INVENTORY BY ID
  export const useGetInventoryById =
    (id) => {
      return useQuery({
        queryKey: [
          "inventory",
          id,
        ],
  
        queryFn: () =>
          getInventoryById(id),
  
        enabled: !!id,
  
        onError: (error) => {
          console.log(
            "GET INVENTORY BY ID HOOK ERROR:",
            error
          );
        },
      });
    };
  
  // CREATE INVENTORY
  export const useCreateInventory =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn:
          createInventory,
  
        onSuccess: (data) => {
          console.log(
            "CREATE INVENTORY SUCCESS:",
            data
          );
  
          queryClient.invalidateQueries(
            {
              queryKey: [
                "inventory",
              ],
            }
          );
        },
  
        onError: (error) => {
          console.log(
            "CREATE INVENTORY HOOK ERROR:",
            error
          );
        },
      });
    };
  
  // UPDATE INVENTORY
  export const useUpdateInventory =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn: ({
          id,
          data,
        }) =>
          updateInventory(
            id,
            data
          ),
  
        onSuccess: (data) => {
          console.log(
            "UPDATE INVENTORY SUCCESS:",
            data
          );
  
          queryClient.invalidateQueries(
            {
              queryKey: [
                "inventory",
              ],
            }
          );
        },
  
        onError: (error) => {
          console.log(
            "UPDATE INVENTORY HOOK ERROR:",
            error
          );
        },
      });
    };
  
  // DELETE INVENTORY
  export const useDeleteInventory =
    () => {
      const queryClient =
        useQueryClient();
  
      return useMutation({
        mutationFn:
          deleteInventory,
  
        onSuccess: (data) => {
          console.log(
            "DELETE INVENTORY SUCCESS:",
            data
          );
  
          queryClient.invalidateQueries(
            {
              queryKey: [
                "inventory",
              ],
            }
          );
        },
  
        onError: (error) => {
          console.log(
            "DELETE INVENTORY HOOK ERROR:",
            error
          );
        },
      });
    };