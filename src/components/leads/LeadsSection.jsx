import { useState } from 'react'; // 1. Import useState
import { Plus, Eye, User } from 'lucide-react';
import { useGetLeads } from '../../features/leads/leadHooks';
import EditLeadModal from './EditLeadModal'; // 2. Import your modal component

const LeadsSection = ({ onOpenModal }) => {
  const { data, isLoading, error } = useGetLeads();

  // 3. State to manage the Edit Modal
  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const leads = data?.data || [];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // 4. Function to handle opening the edit modal
  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error!</div>;

  return (
    <div className="max-w-screen-2xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
          <p className="text-gray-500 text-sm">Manage your business growth effectively.</p>
        </div>
        <button
          onClick={onOpenModal}
          className="bg-black text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          New Lead
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Stage</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Remarks</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Source</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Added</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-xs">
                        {lead.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                      lead.leadStage === 'WON'
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {lead.leadStage}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]">
                    {lead.remark || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.companyName}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium">
                      {lead.leadSource}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {lead.leadOwner?.split('@')[0]}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right text-sm text-gray-500">
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* 5. Attach the click handler to the Eye button */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEditClick(lead)}
                      className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 hover:text-gray-900 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Render the EditLeadModal */}
      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        leadData={selectedLead}
      />
    </div>
  );
};

export default LeadsSection;
