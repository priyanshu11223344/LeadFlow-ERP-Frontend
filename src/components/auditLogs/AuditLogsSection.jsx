import React from "react";

import {
  useGetAuditLogs,
} from "../../features/auditLogs/auditLogHooks";

const AuditLogsSection =
  () => {
    const {
      data,
      isLoading,
    } =
      useGetAuditLogs();

    const logs =
      data?.data || [];

    // Helper function to color-code audit actions dynamically
    const getActionColor = (
      action
    ) => {
      const act =
        action?.toUpperCase() ||
        "";
      if (
        act.includes("CREATE") ||
        act.includes("ADD") ||
        act.includes("POST")
      ) {
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/40";
      }
      if (
        act.includes("DELETE") ||
        act.includes("REMOVE")
      ) {
        return "bg-rose-50 text-rose-700 border border-rose-200/40";
      }
      if (
        act.includes("UPDATE") ||
        act.includes("EDIT") ||
        act.includes("PUT") ||
        act.includes("PATCH")
      ) {
        return "bg-amber-50 text-amber-700 border border-amber-200/40";
      }
      return "bg-slate-100 text-slate-700 border border-slate-200/40";
    };

    if (
      isLoading
    ) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-slate-900 animate-spin"></div>
          </div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">
            Loading audit logs...
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-screen-2xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header Section */}
        <div className="border-b border-slate-100 pb-6">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Audit Logs
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track and monitor all system events and user actions
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {logs.map(
                  (log) => (
                    <tr
                      key={
                        log._id
                      }
                      className="hover:bg-slate-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4.5 text-sm font-semibold text-slate-900">
                        {
                          log.userName
                        }
                      </td>

                      <td className="px-6 py-4.5 text-sm text-slate-500">
                        {
                          log.role
                        }
                      </td>

                      <td className="px-6 py-4.5 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/30">
                          {
                            log.module
                          }
                        </span>
                      </td>

                      <td className="px-6 py-4.5 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getActionColor(
                            log.action
                          )}`}
                        >
                          {
                            log.action
                          }
                        </span>
                      </td>

                      <td
                        className="px-6 py-4.5 text-sm text-slate-600 max-w-xs truncate"
                        title={
                          log.description
                        }
                      >
                        {
                          log.description
                        }
                      </td>

                      <td className="px-6 py-4.5 text-sm text-slate-500 whitespace-nowrap">
                        {new Date(
                          log.createdAt
                        ).toLocaleString()}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  };

export default AuditLogsSection;