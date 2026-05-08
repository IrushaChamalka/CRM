"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  HiOutlineSearch,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineEye,
  HiOutlineFilter,
} from "react-icons/hi";

const STATUSES = ["", "New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const SOURCES = ["", "Website", "LinkedIn", "Referral", "Cold Email", "Event", "Other"];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    salesperson: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      if (filters.salesperson) params.salesperson = filters.salesperson;
      if (filters.search) params.search = filters.search;

      const res = await api.get("/leads", { params });
      setLeads(res.data);
    } catch (error) {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    const debounce = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchLeads]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await api.delete(`/leads/${id}`);
      toast.success("Lead deleted successfully");
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: "", source: "", salesperson: "", search: "" });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const hasActiveFilters = filters.status || filters.source || filters.salesperson || filters.search;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl font-bold text-white">Leads</h1>
              <p className="text-slate-400 mt-1">{leads.length} total leads</p>
            </div>
            <Link
              href="/leads/new"
              id="add-lead-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 
              hover:from-blue-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 
              transition-all duration-200 text-sm"
            >
              <HiOutlinePlusCircle size={20} />
              Add Lead
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="glass-card rounded-2xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  id="search-leads"
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search by name, company, or email..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white 
                  placeholder:text-slate-500 text-sm focus:border-blue-500/50"
                />
              </div>

              <button
                id="toggle-filters"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
                  ${
                    hasActiveFilters
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white"
                  }`}
              >
                <HiOutlineFilter size={18} />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                )}
              </button>
            </div>

            {/* Filter Dropdowns */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-700/30">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select
                    id="filter-status"
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:border-blue-500/50"
                  >
                    <option value="">All Statuses</option>
                    {STATUSES.filter(Boolean).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Source</label>
                  <select
                    id="filter-source"
                    value={filters.source}
                    onChange={(e) => handleFilterChange("source", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:border-blue-500/50"
                  >
                    <option value="">All Sources</option>
                    {SOURCES.filter(Boolean).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Salesperson</label>
                  <input
                    id="filter-salesperson"
                    type="text"
                    value={filters.salesperson}
                    onChange={(e) => handleFilterChange("salesperson", e.target.value)}
                    placeholder="Filter by salesperson"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white 
                    placeholder:text-slate-500 focus:border-blue-500/50"
                  />
                </div>
                {hasActiveFilters && (
                  <button
                    id="clear-filters"
                    onClick={clearFilters}
                    className="text-sm text-red-400 hover:text-red-300 sm:col-span-3"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Leads Table */}
          {loading ? (
            <LoadingSpinner size="lg" />
          ) : leads.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <HiOutlineUsers className="mx-auto text-slate-600 mb-4" size={48} />
              <h3 className="text-lg font-medium text-white mb-2">No leads found</h3>
              <p className="text-slate-400 text-sm mb-6">
                {hasActiveFilters ? "Try adjusting your filters" : "Get started by adding your first lead"}
              </p>
              {!hasActiveFilters && (
                <Link
                  href="/leads/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 
                  text-white font-semibold rounded-xl text-sm"
                >
                  <HiOutlinePlusCircle size={18} />
                  Add Your First Lead
                </Link>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/30">
                      <th className="text-left text-xs font-medium text-slate-400 p-4">Name</th>
                      <th className="text-left text-xs font-medium text-slate-400 p-4 hidden md:table-cell">Company</th>
                      <th className="text-left text-xs font-medium text-slate-400 p-4 hidden lg:table-cell">Source</th>
                      <th className="text-left text-xs font-medium text-slate-400 p-4">Status</th>
                      <th className="text-left text-xs font-medium text-slate-400 p-4 hidden sm:table-cell">Assigned To</th>
                      <th className="text-right text-xs font-medium text-slate-400 p-4">Deal Value</th>
                      <th className="text-right text-xs font-medium text-slate-400 p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <td className="p-4">
                          <Link href={`/leads/${lead._id}`} className="text-sm font-medium text-white hover:text-blue-400">
                            {lead.name}
                          </Link>
                          <p className="text-xs text-slate-500 mt-0.5 md:hidden">{lead.company}</p>
                        </td>
                        <td className="p-4 text-sm text-slate-400 hidden md:table-cell">{lead.company}</td>
                        <td className="p-4 text-sm text-slate-400 hidden lg:table-cell">{lead.source}</td>
                        <td className="p-4">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="p-4 text-sm text-slate-400 hidden sm:table-cell">{lead.assignedTo}</td>
                        <td className="p-4 text-sm text-right text-white font-medium">{formatCurrency(lead.dealValue)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/leads/${lead._id}`}
                              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                              title="View"
                            >
                              <HiOutlineEye size={16} />
                            </Link>
                            <Link
                              href={`/leads/${lead._id}/edit`}
                              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <HiOutlinePencil size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(lead._id, lead.name)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <HiOutlineTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
