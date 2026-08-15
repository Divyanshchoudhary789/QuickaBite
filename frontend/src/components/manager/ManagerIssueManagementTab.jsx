// src/components/manager/ManagerIssueManagementTab.jsx
import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Image as ImageIcon,
  Check,
  X,
  FileText,
} from "lucide-react";
import {
  getRestaurantIssues,
  resolveIssueTicket,
  getUserLoyaltyScore,
} from "../../services/supportIssue.service";

export default function ManagerIssueManagementTab({ restaurantId }) {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [userLoyalty, setUserLoyalty] = useState(null);
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);

  // Resolution Form state
  const [resolutionAction, setResolutionAction] = useState("ACCEPTED"); // "ACCEPTED" | "REJECTED"
  const [refundStatus, setRefundStatus] = useState("FULL"); // "FULL" | "PARTIAL"
  const [refundAmount, setRefundAmount] = useState("");
  const [managerRemark, setManagerRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchIssues();
  }, [restaurantId, statusFilter]);

  const fetchIssues = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRestaurantIssues(
        restaurantId,
        statusFilter === "ALL" ? "" : statusFilter
      );
      setIssues(data || []);
    } catch (err) {
      setError(err.message || "Failed to load restaurant support tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleInspectIssue = async (issue) => {
    setSelectedIssue(issue);
    setResolutionAction("ACCEPTED");
    setRefundStatus("FULL");
    setRefundAmount(issue.order?.totalAmount ? String(issue.order.totalAmount) : "0");
    setManagerRemark("");
    setSuccessMessage("");
    setError("");

    // Fetch user trust & loyalty rating score
    if (issue.user?._id) {
      setLoyaltyLoading(true);
      try {
        const loyaltyData = await getUserLoyaltyScore(issue.user._id);
        setUserLoyalty(loyaltyData);
      } catch (err) {
        console.error("Error fetching user loyalty:", err);
      } finally {
        setLoyaltyLoading(false);
      }
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIssue) return;
    if (resolutionAction === "REJECTED" && !managerRemark.trim()) {
      setError("Please provide a rejection remark to explain to the customer.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await resolveIssueTicket(selectedIssue._id, {
        status: resolutionAction,
        refundStatus: resolutionAction === "ACCEPTED" ? refundStatus : "NONE",
        refundAmount: resolutionAction === "ACCEPTED" ? Number(refundAmount) || 0 : 0,
        managerRemark,
      });

      setSuccessMessage(
        `Issue ticket #${selectedIssue.ticketNumber} successfully marked as ${resolutionAction}. Customer notified!`
      );
      setTimeout(() => {
        setSelectedIssue(null);
        fetchIssues();
      }, 1800);
    } catch (err) {
      setError(err.message || "Failed to resolve ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const getBadge = (status) => {
    if (status === "ACCEPTED") {
      return (
        <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black rounded-full flex items-center gap-1.5 uppercase tracking-wider">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> ACCEPTED
        </span>
      );
    }
    if (status === "REJECTED") {
      return (
        <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black rounded-full flex items-center gap-1.5 uppercase tracking-wider">
          <XCircle className="w-3.5 h-3.5 text-rose-600" /> REJECTED
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black rounded-full flex items-center gap-1.5 uppercase tracking-wider">
        <Clock className="w-3.5 h-3.5 text-amber-600" /> PENDING
      </span>
    );
  };

  const getTrustBadgeComponent = (loyalty) => {
    if (!loyalty) return null;
    if (loyalty.trustBadge === "HIGH_RISK_SUSPICIOUS") {
      return (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-900 text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600" />
          <div>
            <span className="font-black block">FLAGGED USER (High Issue Claim Rate: {loyalty.issueRatioPercent}%)</span>
            <span className="text-[11px] opacity-90 font-medium">{loyalty.trustDescription} • Claims: {loyalty.totalIssuesCount} / Delivered: {loyalty.deliveredOrders}</span>
          </div>
        </div>
      );
    }
    if (loyalty.trustBadge === "MODERATE_RISK") {
      return (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <div>
            <span className="font-black block">MODERATE RISK USER ({loyalty.issueRatioPercent}% Issue Rate)</span>
            <span className="text-[11px] opacity-90 font-medium">{loyalty.trustDescription} • Total Claims: {loyalty.totalIssuesCount}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs">
        <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
        <div>
          <span className="font-black block">LOYAL CUSTOMER ({loyalty.issueRatioPercent}% Issue Rate)</span>
          <span className="text-[11px] opacity-90 font-medium">{loyalty.trustDescription} • Delivered Orders: {loyalty.deliveredOrders}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-neutral-900 font-sans animate-fade-in">
      {/* Top Header & Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-950 text-white border border-neutral-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-orange" />
            Branch Order Issues & Support Claims
          </h2>
          <p className="text-xs text-neutral-300 mt-1 font-medium">
            Inspect customer photo proof, audit user reliability score, and approve or reject refund claims.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["PENDING", "ACCEPTED", "REJECTED", "ALL"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                statusFilter === f
                  ? "bg-brand-orange text-white shadow-md"
                  : "bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Issues List */}
      {loading ? (
        <div className="p-12 text-center text-neutral-500 text-xs font-bold">Loading issue claims...</div>
      ) : issues.length === 0 ? (
        <div className="p-12 bg-white border border-neutral-200 rounded-3xl text-center text-neutral-500 text-xs shadow-xs font-medium">
          No order issues found for filter: <span className="text-brand-orange font-bold">{statusFilter}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white border border-neutral-200/90 hover:border-neutral-300 p-6 rounded-3xl space-y-4 shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div>
                  <span className="text-xs font-black text-brand-orange bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                    Ticket #{issue.ticketNumber}
                  </span>
                  <p className="text-xs font-mono font-bold text-neutral-400 mt-1">Order #{issue.order?.orderNumber || "QB-0000"}</p>
                </div>
                <div>{getBadge(issue.status)}</div>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-black text-neutral-900">{issue.selectedQuestion}</p>
                <p className="text-xs text-neutral-500 font-medium line-clamp-2">
                  Customer: {issue.user?.fullName || "Guest"} • {issue.user?.phone || issue.order?.contactPhone || ""}
                </p>
                {issue.images && issue.images.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-orange font-bold pt-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{issue.images.length} Photo Proof(s) Attached</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-150 flex items-center justify-between">
                <span className="text-xs font-black text-neutral-900">
                  Total Order: ₹{issue.order?.totalAmount || 0}
                </span>
                <button
                  onClick={() => handleInspectIssue(issue)}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Eye className="w-4 h-4 text-brand-orange" /> Inspect & Action
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INSPECTION & ACTION MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white border border-neutral-200 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-neutral-150 flex items-center justify-between bg-neutral-950 text-white">
              <div>
                <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
                  Inspect Ticket #{selectedIssue.ticketNumber}
                </h3>
                <p className="text-xs text-neutral-300 font-medium">Order #{selectedIssue.order?.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-neutral-900">
              {/* User Trust Rating */}
              {loyaltyLoading ? (
                <div className="text-xs text-neutral-500 font-bold">Auditing user reliability score...</div>
              ) : (
                getTrustBadgeComponent(userLoyalty)
              )}

              {/* Order & Issue Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-50 border border-neutral-200/80 rounded-2xl text-xs">
                <div>
                  <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] block">Customer</span>
                  <span className="font-extrabold text-neutral-900">{selectedIssue.user?.fullName} ({selectedIssue.user?.email})</span>
                  <span className="text-neutral-500 block mt-0.5 font-medium">{selectedIssue.order?.contactPhone}</span>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] block">Order Total & Status</span>
                  <span className="font-black text-brand-orange text-sm">₹{selectedIssue.order?.totalAmount}</span>
                  <span className="text-neutral-500 block mt-0.5 uppercase font-semibold">Payment: {selectedIssue.order?.paymentStatus}</span>
                </div>
                <div className="sm:col-span-2 border-t border-neutral-150 pt-2 mt-1">
                  <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] block">Reported Problem</span>
                  <p className="font-black text-neutral-900 text-sm mt-0.5">{selectedIssue.selectedQuestion}</p>
                  {selectedIssue.description && (
                    <p className="text-neutral-700 font-medium italic mt-1 bg-white p-2.5 rounded-xl border border-neutral-200/60">"{selectedIssue.description}"</p>
                  )}
                </div>
              </div>

              {/* Photo Proof Gallery */}
              {selectedIssue.images && selectedIssue.images.length > 0 && (
                <div>
                  <label className="block text-xs font-black text-neutral-900 uppercase tracking-wider mb-2">
                    Customer Photo Proof / Payment Screenshots
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {selectedIssue.images.map((img, idx) => (
                      <a
                        key={idx}
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-28 h-28 rounded-2xl overflow-hidden border border-neutral-200 hover:border-brand-orange transition-all shadow-xs group relative"
                      >
                        <img src={img.url} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-bold transition-opacity">
                          View Full Image
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* RESOLUTION FORM */}
              {selectedIssue.status === "PENDING" ? (
                <form onSubmit={handleResolveSubmit} className="p-6 bg-neutral-50 border border-neutral-200 rounded-3xl space-y-4">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                    Process Manager Decision
                  </h4>

                  {error && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                      {error}
                    </div>
                  )}
                  {successMessage && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold">
                      {successMessage}
                    </div>
                  )}

                  {/* Accept vs Reject Choice */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setResolutionAction("ACCEPTED")}
                      className={`flex-1 py-3 rounded-2xl font-black text-xs border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        resolutionAction === "ACCEPTED"
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                          : "bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <Check className="w-4 h-4 text-emerald-600" /> ACCEPT & REFUND
                    </button>
                    <button
                      type="button"
                      onClick={() => setResolutionAction("REJECTED")}
                      className={`flex-1 py-3 rounded-2xl font-black text-xs border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        resolutionAction === "REJECTED"
                          ? "bg-rose-50 border-rose-300 text-rose-800 shadow-xs"
                          : "bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <X className="w-4 h-4 text-rose-600" /> REJECT CLAIM
                    </button>
                  </div>

                  {/* If ACCEPTED: Refund amount and type */}
                  {resolutionAction === "ACCEPTED" && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-neutral-600 font-bold mb-1">Refund Type</label>
                        <select
                          value={refundStatus}
                          onChange={(e) => {
                            setRefundStatus(e.target.value);
                            if (e.target.value === "FULL") {
                              setRefundAmount(String(selectedIssue.order?.totalAmount || 0));
                            }
                          }}
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-neutral-900 font-bold focus:outline-none focus:border-brand-orange"
                        >
                          <option value="FULL">FULL REFUND (₹{selectedIssue.order?.totalAmount})</option>
                          <option value="PARTIAL">PARTIAL REFUND</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-bold mb-1">Refund Amount (₹)</label>
                        <input
                          type="number"
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-neutral-900 font-bold focus:outline-none focus:border-brand-orange"
                        />
                      </div>
                    </div>
                  )}

                  {/* Manager Remark */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Manager Remark / Explanation (Sent directly to customer as notification)
                    </label>
                    <textarea
                      rows={2}
                      value={managerRemark}
                      onChange={(e) => setManagerRemark(e.target.value)}
                      placeholder="e.g. Approved refund for damaged item / Photos do not match reported issue..."
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-2xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-orange font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedIssue(null)}
                      className="px-4 py-2.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-brand-orange hover:bg-orange-600 text-white font-black rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? "Processing..." : "Confirm & Send Message to User"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs space-y-1">
                  <span className="font-black text-neutral-900 block">Resolution Result ({selectedIssue.status})</span>
                  <p className="text-neutral-800 italic">"{selectedIssue.resolution?.managerRemark}"</p>
                  <p className="text-neutral-500 text-[11px] pt-1">
                    Action by: {selectedIssue.resolution?.actionByRole} on {new Date(selectedIssue.resolution?.actionAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
