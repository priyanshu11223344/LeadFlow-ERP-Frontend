import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTicket,
  getTickets,
  updateTicket,
} from "./ticketAPI";

export const useGetTickets =
  () => {
    return useQuery({
      queryKey: ["tickets"],
      queryFn: getTickets,
    });
  };

export const useCreateTicket =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: createTicket,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tickets"],
        });
      },
    });
  };

export const useUpdateTicket =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: ({
        id,
        data,
      }) =>
        updateTicket(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tickets"],
        });
      },
    });
  };
