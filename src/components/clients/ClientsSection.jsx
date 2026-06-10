import React from "react";
import { Building2, Mail, User } from "lucide-react";

import {
  useGetClients,
} from "../../features/clients/clientHooks";

const ClientsSection = () => {
  const {
    data,
    isLoading,
    error,
  } = useGetClients();

  const clients = data?.data || [];

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        Loading Clients...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load clients
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter">
          Clients
        </h2>

        <p className="text-gray-500 text-sm font-medium">
          Manage all converted clients.
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        <table className="w-full text-left">

          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">

              <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Client
              </th>

              <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Email
              </th>

              <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Company
              </th>

              <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Address
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">

            {clients.length > 0 ? (
              clients.map((client) => (
                <tr
                  key={client._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                        {client.clientName?.charAt(0)}
                      </div>

                      <div>
                        <p className="font-bold text-gray-950">
                          {client.clientName}
                        </p>
                      </div>

                    </div>

                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {client.email}
                    </div>

                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">

                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {client.companyName || "-"}
                    </div>

                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {client.address || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-10 text-gray-400 font-medium"
                >
                  No clients found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ClientsSection;