import API from "../../api/axios";

export const getAuditLogs = async () => {
  const response =
    await API.get(
      "/audit-logs"
    );

  return response.data;
};