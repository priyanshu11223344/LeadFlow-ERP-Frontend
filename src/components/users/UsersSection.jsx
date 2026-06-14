import React, {
    useState,
} from "react";

import {
    Plus,
    Trash2,
    Pencil,
    Power,
} from "lucide-react";

import UserModal from "./UserModal"

import {
    useGetUsers,
    useCreateUser,
    useDeleteUser,
    useUpdateUser,
} from "../../features/users/userHooks";

const UsersSection =
    () => {
        const {
            data,
            isLoading,
        } =
            useGetUsers();

        const createUser =
            useCreateUser();

        const deleteUser =
            useDeleteUser();
        const updateUser =
            useUpdateUser();
        const [
            openModal,
            setOpenModal,
        ] =
            useState(false);
        const [
            selectedUser,
            setSelectedUser,
        ] = useState(null);

        const users =
            data?.data || [];

        const handleCreate =
            async (
                formData
            ) => {
                try {
                    await createUser.mutateAsync(
                        formData
                    );

                    setOpenModal(
                        false
                    );
                } catch (
                error
                ) {
                    alert(
                        error?.response
                            ?.data
                            ?.message ||
                        "Failed to create user"
                    );
                }
            };
        const handleToggleStatus =
            async (user) => {
                try {

                    await updateUser.mutateAsync({
                        id: user._id,
                        data: {
                            isActive:
                                !user.isActive,
                        },
                    });

                } catch (error) {

                    alert(
                        error?.response
                            ?.data
                            ?.message
                    );

                }
            };
        const handleEdit =
            async (formData) => {
                try {

                    await updateUser.mutateAsync({
                        id: selectedUser._id,
                        data: formData,
                    });

                    setSelectedUser(
                        null
                    );

                    setOpenModal(
                        false
                    );

                } catch (error) {

                    alert(
                        error?.response
                            ?.data
                            ?.message
                    );

                }
            };
        const handleDelete =
            async (
                id
            ) => {
                const confirmDelete =
                    window.confirm(
                        "Delete user?"
                    );

                if (
                    !confirmDelete
                )
                    return;

                try {
                    await deleteUser.mutateAsync(
                        id
                    );
                } catch (
                error
                ) {
                    alert(
                        error?.response
                            ?.data
                            ?.message ||
                        "Failed to delete user"
                    );
                }
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
                        Loading users...
                    </p>
                </div>
            );
        }

        return (
            <div className="max-w-screen-2xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Users
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Manage ERP users and access controls
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setOpenModal(
                                true
                            )
                        }
                        className="bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-200 text-sm"
                    >
                        <Plus
                            size={
                                18
                            }
                        />
                        New User
                    </button>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/75">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {users.map(
                                    (
                                        user
                                    ) => (
                                        <tr
                                            key={
                                                user._id
                                            }
                                            className="hover:bg-slate-50/50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                                {
                                                    user.name
                                                }
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {
                                                    user.email
                                                }
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                                {
                                                    user.role
                                                }
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.isActive
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/45"
                                                            : "bg-rose-50 text-rose-700 border border-rose-200/45"
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.isActive
                                                                ? "bg-emerald-500"
                                                                : "bg-rose-500"
                                                            }`}
                                                    />
                                                    {user.isActive
                                                        ? "ACTIVE"
                                                        : "INACTIVE"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(
                                                    user.createdAt
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-center items-center">
                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(
                                                                    user
                                                                );

                                                                setOpenModal(
                                                                    true
                                                                );
                                                            }}
                                                            className="p-2 text-blue-600"
                                                        >
                                                            <Pencil
                                                                size={16}
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    user
                                                                )
                                                            }
                                                            className="p-2 text-yellow-600"
                                                        >
                                                            <Power
                                                                size={16}
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user._id
                                                                )
                                                            }
                                                            className="p-2 text-red-600"
                                                        >
                                                            <Trash2
                                                                size={16}
                                                            />
                                                        </button>

                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {openModal && (
                    <UserModal
                    initialData={
                      selectedUser
                    }
                    onClose={() => {
                      setOpenModal(
                        false
                      );
                  
                      setSelectedUser(
                        null
                      );
                    }}
                    onSubmit={
                      selectedUser
                        ? handleEdit
                        : handleCreate
                    }
                  />
                )}
            </div>
        );
    };

export default UsersSection;