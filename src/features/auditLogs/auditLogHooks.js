import {
    useQuery,
  } from "@tanstack/react-query";
  
  import {
    getAuditLogs,
  } from "./auditLogAPI";
  
  export const useGetAuditLogs =
    () => {
      return useQuery({
        queryKey: [
          "auditLogs",
        ],
  
        queryFn:
          getAuditLogs,
      });
    };