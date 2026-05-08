"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineUser,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineGlobe,
  HiOutlinePaperClip,
} from "react-icons/hi";

const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];

export default function LeadDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchLead();
    fetchNotes();
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
    } catch (error) {
      toast.error("Lead not found");
      router.push("/leads");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await api.get(`/leads/${id}/notes`);
      setNotes(res.data);
    } catch (error) {
      console.error("Failed to load notes");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    setAddingNote(true);
    try {
      const res = await api.post(`/leads/${id}/notes`, { content: newNote });
      setNotes((prev) => [res.data, ...prev]);
      setNewNote("");
      toast.success("Note added successfully");
    } catch (error) {
      toast.error("Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.patch(`/leads/${id}/status`, { status: newStatus });
      setLead(res.data);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${lead?.name}"?`)) return;

    try {
      await api.delete(`/leads/${id}`);
      toast.success("Lead deleted successfully");
      router.push("/leads");
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 lg:p-8">
          {loading ? (
            <LoadingSpinner size="lg" />
          ) : lead ? (
            <>
              {/* Header */}
              <div className="mb-6 pt-12 lg:pt-0">
                <Link
                  href="/leads"
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
                >
                  <HiOutlineArrowLeft size={16} />
                  Back to Leads
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white">{lead.name}</h1>
                    <p className="text-slate-400 mt-1">{lead.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/leads/${id}/edit`}
                      id="edit-lead-btn"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 
                      text-slate-300 font-medium rounded-xl text-sm transition-all border border-slate-700/50"
                    >
                      <HiOutlinePencil size={16} />
                      Edit
                    </Link>
                    <button
                      id="delete-lead-btn"
                      onClick={handleDelete}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 
                      text-red-400 font-medium rounded-xl text-sm transition-all border border-red-500/20"
                    >
                      <HiOutlineTrash size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lead Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Details Card */}
                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Lead Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DetailItem icon={<HiOutlineMail size={18} />} label="Email" value={lead.email} />
                      <DetailItem icon={<HiOutlinePhone size={18} />} label="Phone" value={lead.phone || "N/A"} />
                      <DetailItem icon={<HiOutlineOfficeBuilding size={18} />} label="Company" value={lead.company} />
                      <DetailItem icon={<HiOutlineGlobe size={18} />} label="Lead Source" value={lead.source} />
                      <DetailItem icon={<HiOutlineUser size={18} />} label="Assigned To" value={lead.assignedTo} />
                      <DetailItem
                        icon={<HiOutlineCurrencyDollar size={18} />}
                        label="Deal Value"
                        value={formatCurrency(lead.dealValue)}
                      />
                      <DetailItem icon={<HiOutlineClock size={18} />} label="Created" value={formatDate(lead.createdAt)} />
                      <DetailItem icon={<HiOutlineClock size={18} />} label="Last Updated" value={formatDate(lead.updatedAt)} />
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">
                      <HiOutlinePaperClip className="inline mr-2" size={20} />
                      Notes ({notes.length})
                    </h2>

                    {/* Add Note Form */}
                    <form onSubmit={handleAddNote} className="mb-6">
                      <textarea
                        id="note-content"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note about this lead..."
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white 
                        placeholder:text-slate-500 text-sm focus:border-blue-500/50 resize-none"
                      />
                      <button
                        type="submit"
                        id="add-note-btn"
                        disabled={addingNote}
                        className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm
                        disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {addingNote ? "Adding..." : "Add Note"}
                      </button>
                    </form>

                    {/* Notes List */}
                    {notes.length === 0 ? (
                      <p className="text-slate-500 text-sm">No notes yet. Add the first note above.</p>
                    ) : (
                      <div className="space-y-3">
                        {notes.map((note) => (
                          <div key={note._id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/20">
                            <p className="text-sm text-slate-200 whitespace-pre-wrap">{note.content}</p>
                            <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                              <span>{note.createdBy}</span>
                              <span>•</span>
                              <span>{formatDate(note.createdAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar - Status & Quick Actions */}
                <div className="space-y-6">
                  {/* Current Status */}
                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Status</h2>
                    <div className="mb-4">
                      <StatusBadge status={lead.status} />
                    </div>

                    {/* Status Update Buttons */}
                    <p className="text-xs text-slate-500 mb-3">Update status:</p>
                    <div className="space-y-2">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(s)}
                          disabled={updatingStatus || lead.status === s}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${
                              lead.status === s
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30 cursor-default"
                                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white border border-slate-700/30"
                            }
                            disabled:opacity-50`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-400">Lead not found.</p>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-slate-800/50 text-slate-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}
