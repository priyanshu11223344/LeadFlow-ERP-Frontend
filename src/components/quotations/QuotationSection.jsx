import React, { useState, useMemo } from "react";
import {
    Search,
    Plus,
    TrendingUp,
    FileText,
    CheckCircle2,
    AlertTriangle,
    MoreVertical,
    Download,
    Eye,
    RefreshCw,
    FileSpreadsheet,
    Building2,
    User,
    Clock,
    Ban,
    ArrowUpRight, Pencil, GitBranch
} from "lucide-react";
import {
    useGetQuotations,
    useConvertQuotation, useDownloadQuotationPdf
} from "../../features/quotations/quotationHooks";
import QuotationViewModal from "./QuotationViewModal";
import QuotationStatusModal from "./QuotationStatusModal";
const QuotationSection = ({ onCreateNewClick }) => {
    const downloadPdfMutation =
        useDownloadQuotationPdf();
    const convertQuotationMutation =
        useConvertQuotation();
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useGetQuotations();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [
        isStatusModalOpen,
        setIsStatusModalOpen,
    ] = useState(false);
    const [selectedQuotation, setSelectedQuotation] =
        useState(null);

    const [isViewOpen, setIsViewOpen] =
        useState(false);
    const quotations = data?.data || [];
    const handleConvertQuotation =
        async (quotationId) => {
            try {
                await convertQuotationMutation.mutateAsync(
                    quotationId
                );

                alert(
                    "Quotation converted successfully"
                );
            } catch (error) {
                alert(
                    error?.response?.data
                        ?.message ||
                    "Conversion failed"
                );
            }
        };
    const handleDownloadPdf =
        async (
            quotationId,
            quotationNumber
        ) => {
            try {
                const blob =
                    await downloadPdfMutation.mutateAsync(
                        quotationId
                    );

                const url =
                    window.URL.createObjectURL(
                        new Blob([blob])
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.href = url;

                link.download =
                    `${quotationNumber}.pdf`;

                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();

                window.URL.revokeObjectURL(
                    url
                );
            } catch (error) {
                console.log(error);
            }
        };
    // KPI Calculations
    const { totalVolume, averageValue, acceptedCount, conversionRate } = useMemo(() => {
        if (quotations.length === 0) {
            return { totalVolume: 0, averageValue: 0, acceptedCount: 0, conversionRate: 0 };
        }
        const total = quotations.reduce((sum, q) => sum + (q.grandTotal || 0), 0);
        const avg = total / quotations.length;
        const accepted = quotations.filter(q => {
            const s = q.status?.toLowerCase();
            return s === 'approved';
        }).length;
        const rate = (accepted / quotations.length) * 100;
        return {
            totalVolume: total,
            averageValue: avg,
            acceptedCount: accepted,
            conversionRate: rate
        };
    }, [quotations]);

    // Filtering Logic
    const filteredQuotations = useMemo(() => {
        return quotations.filter((q) => {
            const nameMatch = q.leadId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            const companyMatch = q.leadId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            const numMatch = q.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            const matchesSearch = nameMatch || companyMatch || numMatch;

            const matchesStatus =
                statusFilter === "ALL" ||
                q.status?.toUpperCase() === statusFilter.toUpperCase();

            return matchesSearch && matchesStatus;
        });
    }, [quotations, searchTerm, statusFilter]);

    const formatCurrency = (val) => {
        if (val === undefined || val === null || isNaN(val)) return "₹0.00";
        return `₹${Number(val).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const getStatusBadge = (status) => {
        const s = status?.toUpperCase();
        switch (s) {
            case "DRAFT":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200/80">
                        <Clock className="w-3 h-3" />
                        Draft
                    </span>
                );
            case "SENT":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                        <ArrowUpRight className="w-3 h-3" />
                        Sent
                    </span>
                );

            case "NEGOTIATION":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                        <AlertTriangle className="w-3 h-3" />
                        Negotiation
                    </span>
                );

            case "CONVERTED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                        <CheckCircle2 className="w-3 h-3" />
                        Converted
                    </span>
                );
            case "APPROVED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" />
                        Accepted
                    </span>
                );
            case "REJECTED":
            case "DECLINED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                        <Ban className="w-3 h-3" />
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
                        {status || "Unknown"}
                    </span>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto space-y-8 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
                        <div className="h-4 w-72 bg-slate-100 rounded-md" />
                    </div>
                    <div className="h-10 w-36 bg-slate-200 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-28 bg-slate-100 border border-slate-200 rounded-2xl" />
                    ))}
                </div>
                <div className="h-12 bg-slate-100 rounded-xl" />
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-96" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-screen-2xl mx-auto py-16">
                <div className="flex flex-col items-center justify-center p-8 bg-rose-50/20 border border-rose-100 rounded-2xl text-center max-w-lg mx-auto space-y-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-slate-800 text-lg">Failed to load quotations</h3>
                        <p className="text-sm text-slate-400">
                            There was an issue fetching the quotation data from the server. Please try again.
                        </p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-rose-600/10"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto space-y-8 p-1">

            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Quotations
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Draft, track, and manage commercial quotation records for your active leads.
                    </p>
                </div>
                
            </div>

            {/* KPI STATISTICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Stat 1: Total Volume */}
                <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between">
                    <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Value</div>
                        <div className="text-2xl font-extrabold text-slate-800">{formatCurrency(totalVolume)}</div>
                        <div className="text-[10px] text-indigo-600 font-bold flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Across {quotations.length} total offers</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/30">
                        <FileSpreadsheet className="w-5.5 h-5.5" />
                    </div>
                </div>

                {/* Stat 2: Conversion / Accepted */}
                <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between">
                    <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accepted Offers</div>
                        <div className="text-2xl font-extrabold text-slate-800">{acceptedCount}</div>
                        <div className="text-[10px] text-slate-400 font-medium">
                            Conversion rate: <span className="text-emerald-600 font-bold">{conversionRate.toFixed(0)}%</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/30">
                        <CheckCircle2 className="w-5.5 h-5.5" />
                    </div>
                </div>

                {/* Stat 3: Average Quotation Value */}
                <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between">
                    <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Deal Size</div>
                        <div className="text-2xl font-extrabold text-slate-800">{formatCurrency(averageValue)}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Average invoice amount</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100/30">
                        <FileText className="w-5.5 h-5.5" />
                    </div>
                </div>

            </div>

            {/* FILTER & SEARCH ACTIONS PANEL */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-5 space-y-4">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* SEARCH BAR */}
                    <div className="relative flex items-center shadow-sm rounded-xl border border-slate-200 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all bg-white overflow-hidden max-w-md w-full">
                        <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search quotation #, lead, or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2.5 pl-11 pr-4 text-slate-700 text-sm outline-none border-none placeholder-slate-400 bg-transparent"
                        />
                    </div>

                    {/* STATUS TABS */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
                        {[
                            "ALL",
                            "DRAFT",
                            "SENT",
                            "NEGOTIATION",
                            "APPROVED",
                            "REJECTED",
                            "CONVERTED"
                        ].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === status
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* QUOTATIONS TABLE GRID */}
                {filteredQuotations.length > 0 ? (
                    <div className="border border-slate-150 rounded-xl overflow-hidden bg-white">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-4.5 text-left">Quotation ID</th>
                                        <th className="px-6 py-4.5 text-left">Client Lead</th>
                                        <th className="px-6 py-4.5 text-center">Version</th>
                                        <th className="px-6 py-4.5 text-center">Status</th>
                                        <th className="px-6 py-4.5 text-center">
                                            Created
                                        </th>
                                        <th className="px-6 py-4.5 text-right">Grand Total</th>
                                        <th className="px-6 py-4.5 text-center w-12"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-150/60 text-slate-700 text-sm">
                                    {filteredQuotations.map((quotation) => (
                                        <tr
                                            key={quotation._id}
                                            className="hover:bg-slate-50/20 transition-colors group"
                                        >
                                            {/* Quotation Number */}
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-indigo-500/80" />
                                                        {quotation.quotationNumber}
                                                    </div>

                                                    <div className="text-xs text-slate-400 mt-1">
                                                        {quotation.items?.length || 0} Items
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Lead Details */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-0.5">
                                                    <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                                        {quotation.leadId?.name || "Unassigned"}
                                                    </div>
                                                    {quotation.leadId?.companyName && (
                                                        <div className="text-xs text-slate-400 flex items-center gap-1.5 pl-5">
                                                            <Building2 className="w-3 h-3 text-slate-300" />
                                                            {quotation.leadId.companyName}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Version */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold text-slate-500 bg-slate-50 border border-slate-200/80">
                                                    v{quotation.version || 1}
                                                </span>
                                            </td>

                                            {/* Status badge */}
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(quotation.status)}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-slate-500">
                                                {new Date(
                                                    quotation.createdAt
                                                ).toLocaleDateString("en-IN")}
                                            </td>
                                            {/* Grand Total */}
                                            <td className="px-6 py-4 text-right font-extrabold text-slate-800 text-sm">
                                                {formatCurrency(quotation.grandTotal)}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedQuotation(quotation);
                                                            setIsViewOpen(true);
                                                        }}
                                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="View Quotation"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedQuotation(
                                                                quotation
                                                            );

                                                            setIsStatusModalOpen(
                                                                true
                                                            );
                                                        }}
                                                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    {quotation.status ===
                                                        "APPROVED" &&
                                                        !quotation.dealId && (
                                                            <button
                                                                onClick={() =>
                                                                    handleConvertQuotation(
                                                                        quotation._id
                                                                    )
                                                                }
                                                                className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                                title="Convert To Deal"
                                                            >
                                                                <GitBranch className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    <button
                                                        onClick={() =>
                                                            handleDownloadPdf(
                                                                quotation._id,
                                                                quotation.quotationNumber
                                                            )
                                                        }
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Download PDF"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="border border-dashed border-slate-200 rounded-xl p-12 text-center bg-slate-50/20">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                            <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">No quotations found</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            {searchTerm || statusFilter !== "ALL"
                                ? "No records matched your search query or status filter. Try clearing filters or altering search keywords."
                                : "Get started by generating your first customer quotation. Click the 'New Quotation' button at the top right."}
                        </p>
                        {(searchTerm || statusFilter !== "ALL") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("ALL");
                                }}
                                className="mt-4 px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-800 rounded-xl text-xs font-semibold shadow-sm transition-all"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
            <QuotationViewModal
                isOpen={isViewOpen}
                onClose={() => {
                    setIsViewOpen(false);
                    setSelectedQuotation(null);
                }}
                quotation={selectedQuotation}
            />
            <QuotationStatusModal
                isOpen={
                    isStatusModalOpen
                }
                onClose={() => {
                    setIsStatusModalOpen(false);
                    setSelectedQuotation(null);
                }}
                quotation={
                    selectedQuotation
                }
            />


        </div>

    );
};

export default QuotationSection;