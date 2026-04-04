import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import {
  Loader2,
  AlertCircle,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "quoted", label: "Quoted" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
];

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-800 border-yellow-200",
  quoted: "bg-blue-50 text-blue-800 border-blue-200",
  accepted: "bg-green-50 text-green-800 border-green-200",
  rejected: "bg-red-50 text-red-800 border-red-200",
  completed: "bg-sienna/10 text-sienna border border-border",
};

export default function AdminBulkOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bulkOrders, setBulkOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [expanded, setExpanded] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(null);

  const fetchBulk = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set("page", searchParams.get("page") || "1");
      params.set("limit", "10");
      if (statusFilter) params.set("status", statusFilter);
      const { data } = await api.get(`/admin/bulk-orders?${params}`);
      setBulkOrders(data.data.bulkOrders);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bulk quotations.");
    } finally {
      setLoading(false);
    }
  }, [searchParams, statusFilter]);

  useEffect(() => {
    fetchBulk();
  }, [fetchBulk]);

  const applyFilter = (e) => {
    e.preventDefault();
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", "1");
      if (statusFilter) p.set("status", statusFilter);
      else p.delete("status");
      return p;
    });
  };

  const updateStatus = async (id, status) => {
    try {
      setSaving(id);
      await api.patch(`/admin/bulk-orders/${id}`, { status });
      toast.success("Status updated");
      fetchBulk();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(null);
    }
  };

  const saveNotes = async (id) => {
    try {
      setSaving(id);
      await api.patch(`/admin/bulk-orders/${id}`, { adminNotes });
      toast.success("Notes saved");
      setExpanded(null);
      fetchBulk();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(null);
    }
  };

  const goToPage = (page) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", String(page));
      return p;
    });
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1
          className="text-espresso leading-tight"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 400,
          }}
        >
          Bulk quotations
        </h1>
        <p className="text-fog text-sm mt-1">
          Wholesale RFQs — review, quote, and update status.
        </p>
      </div>

      <form onSubmit={applyFilter} className="card p-4 flex flex-col sm:flex-row gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="field w-full sm:w-56"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary text-[13px] py-2.5 px-5">
          Filter
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-tan animate-spin" />
        </div>
      ) : error ? (
        <div className="card flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rust" />
          <p className="text-sm text-espresso">{error}</p>
        </div>
      ) : bulkOrders.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="w-12 h-12 text-fog/30 mx-auto mb-4" />
          <p className="text-fog text-sm">No bulk quotation requests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bulkOrders.map((bo) => {
            const isOpen = expanded === bo._id;
            return (
              <div key={bo._id} className="card p-0 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(isOpen ? null : bo._id);
                    setAdminNotes(bo.adminNotes || "");
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-linen/20 text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-espresso">
                      {bo.user?.username || "Customer"} · {formatDate(bo.createdAt)}
                    </p>
                    <p className="text-xs text-fog mt-0.5">
                      {bo.products?.length || 0} product line(s) · {bo.currency}{" "}
                      {bo.totalEstimatedValue?.toFixed(2)}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                      STATUS_STYLES[bo.status] || ""
                    }`}
                  >
                    {bo.status}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-border p-4 bg-linen/20 space-y-4 text-sm">
                    <div className="text-fog">Customer: {bo.user?.email}</div>
                    <div className="space-y-2">
                      {bo.products?.map((p, i) => (
                        <div
                          key={i}
                          className="flex justify-between bg-paper p-3 rounded-xl border border-border/40"
                        >
                          <span className="text-espresso">{p.name}</span>
                          <span className="text-fog">
                            ×{p.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {bo.status === "pending" && (
                        <>
                          <button
                            type="button"
                            disabled={saving === bo._id}
                            onClick={() => updateStatus(bo._id, "quoted")}
                            className="btn-outline text-xs py-2 px-3"
                          >
                            Mark quoted
                          </button>
                          <button
                            type="button"
                            disabled={saving === bo._id}
                            onClick={() => updateStatus(bo._id, "rejected")}
                            className="border border-rust/30 text-rust text-xs py-2 px-3 rounded-full hover:bg-rust/10"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {bo.status === "quoted" && (
                        <>
                          <button
                            type="button"
                            disabled={saving === bo._id}
                            onClick={() => updateStatus(bo._id, "accepted")}
                            className="btn-primary text-xs py-2 px-3"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            disabled={saving === bo._id}
                            onClick={() => updateStatus(bo._id, "rejected")}
                            className="btn-outline text-xs py-2 px-3"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {bo.status === "accepted" && (
                        <button
                          type="button"
                          disabled={saving === bo._id}
                          onClick={() => updateStatus(bo._id, "completed")}
                          className="btn-primary text-xs py-2 px-3"
                        >
                          Mark completed
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-fog uppercase tracking-wide">Admin notes</label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="field mt-1 h-24 text-sm"
                        placeholder="Internal notes for this quotation…"
                      />
                      <button
                        type="button"
                        disabled={saving === bo._id}
                        onClick={() => saveNotes(bo._id)}
                        className="btn-primary text-xs py-2 px-4 mt-2"
                      >
                        Save notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-2 pt-2">
              <p className="text-fog text-xs">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-1.5 rounded-lg hover:bg-linen disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="p-1.5 rounded-lg hover:bg-linen disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
