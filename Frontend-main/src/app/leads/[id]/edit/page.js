"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import toast from "react-hot-toast";
import { HiOutlineArrowLeft } from "react-icons/hi";

const SOURCES = ["Website", "LinkedIn", "Referral", "Cold Email", "Event", "Other"];
const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];

export default function EditLeadPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "Other",
    assignedTo: "",
    status: "New",
    dealValue: "",
  });

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      const lead = res.data;
      setFormData({
        name: lead.name || "",
        company: lead.company || "",
        email: lead.email || "",
        phone: lead.phone || "",
        source: lead.source || "Other",
        assignedTo: lead.assignedTo || "",
        status: lead.status || "New",
        dealValue: lead.dealValue?.toString() || "",
      });
    } catch (error) {
      toast.error("Lead not found");
      router.push("/leads");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.company || !formData.email || !formData.assignedTo) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        dealValue: formData.dealValue ? Number(formData.dealValue) : 0,
      };
      await api.put(`/leads/${id}`, payload);
      toast.success("Lead updated successfully!");
      router.push(`/leads/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 lg:p-8">
          {loading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <>
              {/* Header */}
              <div className="mb-6 pt-12 lg:pt-0">
                <Link
                  href={`/leads/${id}`}
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
                >
                  <HiOutlineArrowLeft size={16} />
                  Back to Lead
                </Link>
                <h1 className="text-3xl font-bold text-white">Edit Lead</h1>
                <p className="text-slate-400 mt-1">Update the lead information</p>
              </div>

              {/* Form */}
              <div className="glass-card rounded-2xl p-6 lg:p-8 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Name & Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                        Lead Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:border-blue-500/50"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                        Company Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:border-blue-500/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:border-blue-500/50"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:border-blue-500/50"
                      />
                    </div>
                  </div>

                  {/* Row 3: Source & Assigned To */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="source" className="block text-sm font-medium text-slate-300 mb-2">
                        Lead Source
                      </label>
                      <select
                        id="source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:border-blue-500/50"
                      >
                        {SOURCES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="assignedTo" className="block text-sm font-medium text-slate-300 mb-2">
                        Assigned Salesperson <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="assignedTo"
                        name="assignedTo"
                        type="text"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:border-blue-500/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 4: Status & Deal Value */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:border-blue-500/50"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="dealValue" className="block text-sm font-medium text-slate-300 mb-2">
                        Estimated Deal Value ($)
                      </label>
                      <input
                        id="dealValue"
                        name="dealValue"
                        type="number"
                        min="0"
                        value={formData.dealValue}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:border-blue-500/50"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      id="update-lead-btn"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 
                      text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <Link
                      href={`/leads/${id}`}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition-all"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
