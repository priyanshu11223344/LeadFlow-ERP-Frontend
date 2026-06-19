import {
  useState,
} from "react";
import {
  LifeBuoy,
  Plus,
  X,
} from "lucide-react";

import {
  useCreateTicket,
  useGetTickets,
  useUpdateTicket,
} from "../../features/tickets/ticketHooks";

const departments = [
  "SALES",
  "INVENTORY",
  "PROCUREMENT",
  "FINANCE",
  "ADMIN",
];

const statuses = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const TicketsSection = () => {
  const { data, isLoading } =
    useGetTickets();
  const createMutation =
    useCreateTicket();
  const updateMutation =
    useUpdateTicket();

  const tickets =
    data?.data || [];

  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [selectedTicket, setSelectedTicket] =
    useState(null);
  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      department: "ADMIN",
      priority: "MEDIUM",
    });
  const [comment, setComment] =
    useState("");

  const resetCreateForm = () => {
    setFormData({
      title: "",
      description: "",
      department: "ADMIN",
      priority: "MEDIUM",
    });
  };

  const handleCreate =
    async () => {
      if (
        !formData.title ||
        !formData.description
      ) {
        alert(
          "Please enter title and description"
        );
        return;
      }

      await createMutation.mutateAsync(
        formData
      );
      resetCreateForm();
      setIsModalOpen(false);
    };

  const handleUpdate =
    async () => {
      await updateMutation.mutateAsync({
        id: selectedTicket._id,
        data: {
          status:
            selectedTicket.status,
          department:
            selectedTicket.department,
          priority:
            selectedTicket.priority,
          comment,
        },
      });

      setSelectedTicket(null);
      setComment("");
    };

  const getStatusStyle = (status) => {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter">
            Tickets
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Create, assign, track, and resolve internal workflow issues.
          </p>
        </div>
        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <LifeBuoy className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold text-gray-950">
                          {ticket.ticketNumber} - {ticket.title}
                        </p>
                        <p className="line-clamp-1 text-xs text-gray-500">
                          {ticket.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                    {ticket.department}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                    {ticket.priority}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${getStatusStyle(ticket.status)}`}>
                      {ticket.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {ticket.createdByName || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        setSelectedTicket(
                          ticket
                        )
                      }
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <TicketCreateModal
          formData={formData}
          setFormData={setFormData}
          onClose={() =>
            setIsModalOpen(false)
          }
          onSubmit={handleCreate}
          isPending={
            createMutation.isPending
          }
        />
      )}

      {selectedTicket && (
        <TicketManageModal
          ticket={selectedTicket}
          setTicket={setSelectedTicket}
          comment={comment}
          setComment={setComment}
          onClose={() =>
            setSelectedTicket(null)
          }
          onSubmit={handleUpdate}
          isPending={
            updateMutation.isPending
          }
        />
      )}
    </div>
  );
};

const TicketCreateModal = ({
  formData,
  setFormData,
  onClose,
  onSubmit,
  isPending,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
    <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
      <ModalHeader
        title="New Ticket"
        onClose={onClose}
      />
      <div className="space-y-4 p-6">
        <input
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
            })
          }
          placeholder="Issue title"
          className="w-full rounded-xl border border-gray-200 px-4 py-3"
        />
        <textarea
          value={
            formData.description
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              description:
                e.target.value,
            })
          }
          placeholder="Describe the issue"
          className="min-h-28 w-full rounded-xl border border-gray-200 px-4 py-3"
        />
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            value={
              formData.department
            }
            onChange={(value) =>
              setFormData({
                ...formData,
                department: value,
              })
            }
            options={departments}
          />
          <SelectField
            value={formData.priority}
            onChange={(value) =>
              setFormData({
                ...formData,
                priority: value,
              })
            }
            options={[
              "LOW",
              "MEDIUM",
              "HIGH",
              "URGENT",
            ]}
          />
        </div>
      </div>
      <ModalFooter
        onClose={onClose}
        onSubmit={onSubmit}
        isPending={isPending}
        submitLabel="Create Ticket"
      />
    </div>
  </div>
);

const TicketManageModal = ({
  ticket,
  setTicket,
  comment,
  setComment,
  onClose,
  onSubmit,
  isPending,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
    <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
      <ModalHeader
        title={ticket.ticketNumber}
        onClose={onClose}
      />
      <div className="space-y-4 p-6">
        <p className="text-sm font-bold text-gray-950">
          {ticket.title}
        </p>
        <p className="text-sm text-gray-500">
          {ticket.description}
        </p>
        <div className="grid grid-cols-3 gap-3">
          <SelectField
            value={ticket.status}
            onChange={(value) =>
              setTicket({
                ...ticket,
                status: value,
              })
            }
            options={statuses}
          />
          <SelectField
            value={ticket.department}
            onChange={(value) =>
              setTicket({
                ...ticket,
                department: value,
              })
            }
            options={departments}
          />
          <SelectField
            value={ticket.priority}
            onChange={(value) =>
              setTicket({
                ...ticket,
                priority: value,
              })
            }
            options={[
              "LOW",
              "MEDIUM",
              "HIGH",
              "URGENT",
            ]}
          />
        </div>
        <textarea
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          placeholder="Add internal comment"
          className="min-h-24 w-full rounded-xl border border-gray-200 px-4 py-3"
        />
        <div className="space-y-2">
          {(ticket.comments || []).map(
            (item) => (
              <div
                key={item._id}
                className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600"
              >
                <p className="font-bold text-gray-800">
                  {item.createdByName ||
                    "Team"}
                </p>
                {item.message}
              </div>
            )
          )}
        </div>
      </div>
      <ModalFooter
        onClose={onClose}
        onSubmit={onSubmit}
        isPending={isPending}
        submitLabel="Save Ticket"
      />
    </div>
  </div>
);

const ModalHeader = ({
  title,
  onClose,
}) => (
  <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
    <h3 className="text-lg font-bold text-gray-950">
      {title}
    </h3>
    <button
      onClick={onClose}
      className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
    >
      <X className="h-5 w-5" />
    </button>
  </div>
);

const ModalFooter = ({
  onClose,
  onSubmit,
  isPending,
  submitLabel,
}) => (
  <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
    <button
      onClick={onClose}
      className="text-sm font-bold text-gray-500"
    >
      Cancel
    </button>
    <button
      onClick={onSubmit}
      disabled={isPending}
      className="rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white disabled:bg-gray-400"
    >
      {isPending
        ? "Saving..."
        : submitLabel}
    </button>
  </div>
);

const SelectField = ({
  value,
  onChange,
  options,
}) => (
  <select
    value={value}
    onChange={(e) =>
      onChange(e.target.value)
    }
    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold"
  >
    {options.map((option) => (
      <option
        key={option}
        value={option}
      >
        {option.replace("_", " ")}
      </option>
    ))}
  </select>
);

export default TicketsSection;
