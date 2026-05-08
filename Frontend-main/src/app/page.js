"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  HiOutlineUsers,
  HiOutlineStar,
  HiOutlineTrendingUp,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 pt-12 lg:pt-0">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Overview of your sales pipeline</p>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" />
          ) : stats ? (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  id="stat-total-leads"
                  label="Total Leads"
                  value={stats.totalLeads}
                  icon={<HiOutlineUsers size={24} />}
                  gradient="from-blue-500 to-blue-600"
                />
                <StatCard
                  id="stat-new-leads"
                  label="New Leads"
                  value={stats.newLeads}
                  icon={<HiOutlineStar size={24} />}
                  gradient="from-violet-500 to-violet-600"
                />
                <StatCard
                  id="stat-won-leads"
                  label="Won Leads"
                  value={stats.wonLeads}
                  icon={<HiOutlineCheckCircle size={24} />}
                  gradient="from-emerald-500 to-emerald-600"
                />
                <StatCard
                  id="stat-lost-leads"
                  label="Lost Leads"
                  value={stats.lostLeads}
                  icon={<HiOutlineXCircle size={24} />}
                  gradient="from-red-500 to-red-600"
                />
              </div>

              {/* Value Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <HiOutlineCurrencyDollar className="text-cyan-400" size={24} />
                    </div>
                    <span className="text-sm text-slate-400">Total Pipeline Value</span>
                  </div>
                  <p id="stat-total-value" className="text-3xl font-bold text-white">
                    {formatCurrency(stats.totalDealValue)}
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <HiOutlineTrendingUp className="text-emerald-400" size={24} />
                    </div>
                    <span className="text-sm text-slate-400">Won Deal Value</span>
                  </div>
                  <p id="stat-won-value" className="text-3xl font-bold text-white">
                    {formatCurrency(stats.wonDealValue)}
                  </p>
                </div>
              </div>

              {/* Charts and Recent Leads */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Leads by Source Pie Chart */}
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Leads by Source</h2>
                  {stats.leadsBySource && stats.leadsBySource.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.leadsBySource.map((s) => ({
                              name: s._id,
                              value: s.count,
                            }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {stats.leadsBySource.map((_, index) => (
                              <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #334155",
                              borderRadius: "8px",
                              color: "#e2e8f0",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-wrap gap-3 justify-center mt-2">
                        {stats.leadsBySource.map((s, i) => (
                          <div key={s._id} className="flex items-center gap-1.5 text-xs text-slate-400">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            />
                            {s._id} ({s.count})
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No data available</p>
                  )}
                </div>

                {/* Pipeline Overview */}
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Pipeline Breakdown</h2>
                  <div className="space-y-3">
                    <PipelineBar label="New" count={stats.newLeads} total={stats.totalLeads} color="bg-blue-500" />
                    <PipelineBar label="Contacted" count={stats.contactedLeads} total={stats.totalLeads} color="bg-amber-500" />
                    <PipelineBar label="Qualified" count={stats.qualifiedLeads} total={stats.totalLeads} color="bg-violet-500" />
                    <PipelineBar label="Proposal Sent" count={stats.proposalSentLeads} total={stats.totalLeads} color="bg-cyan-500" />
                    <PipelineBar label="Won" count={stats.wonLeads} total={stats.totalLeads} color="bg-emerald-500" />
                    <PipelineBar label="Lost" count={stats.lostLeads} total={stats.totalLeads} color="bg-red-500" />
                  </div>
                </div>
              </div>

              {/* Recent Leads */}
              <div className="glass-card rounded-2xl p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Recent Leads</h2>
                  <Link
                    href="/leads"
                    id="view-all-leads"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    View All <HiOutlineArrowRight size={14} />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">Name</th>
                        <th className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">Company</th>
                        <th className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">Status</th>
                        <th className="text-right text-xs font-medium text-slate-400 pb-3">Deal Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentLeads?.map((lead) => (
                        <tr key={lead._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                          <td className="py-3 pr-4">
                            <Link href={`/leads/${lead._id}`} className="text-sm text-white hover:text-blue-400">
                              {lead.name}
                            </Link>
                          </td>
                          <td className="py-3 pr-4 text-sm text-slate-400">{lead.company}</td>
                          <td className="py-3 pr-4">
                            <StatusBadge status={lead.status} />
                          </td>
                          <td className="py-3 text-sm text-right text-white">{formatCurrency(lead.dealValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-400">Failed to load dashboard data.</p>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ id, label, value, icon, gradient }) {
  return (
    <div id={id} className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-400">{label}</span>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-lg`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white">{value ?? 0}</p>
    </div>
  );
}

function PipelineBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="text-sm text-slate-400">{count ?? 0}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
