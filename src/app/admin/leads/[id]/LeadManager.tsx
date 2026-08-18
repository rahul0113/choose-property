"use client";

import { useState } from "react";
import { addLeadActivity, updateLeadStatus, convertLeadToBuyer } from "@/app/actions/leads";
import { formatDistanceToNow, format } from "date-fns";
import { MessageSquare, Phone, Calendar, CheckCircle2, User, FileText, Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUSES = [
  "new",
  "contacted",
  "interested",
  "follow_up",
  "site_visit",
  "negotiation",
  "converted",
  "lost"
];

const ACTIVITY_ICONS: Record<string, any> = {
  enquiry_received: FileText,
  whatsapp: MessageSquare,
  called: Phone,
  site_visit_scheduled: Calendar,
  site_visit_completed: CheckCircle2,
  follow_up: Calendar,
  note: FileText,
  status_change: CheckCircle2,
};

export function LeadManager({
  lead,
  activities,
  isConverted,
}: {
  lead: any;
  activities: any[];
  isConverted: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === lead.status) return;
    
    setIsSubmitting(true);
    setError("");
    const res = await updateLeadStatus(lead.id, newStatus);
    if (res?.error) {
      setError(res.error);
    }
    setIsSubmitting(false);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSubmitting(true);
    setError("");
    const res = await addLeadActivity(lead.id, "note", note);
    if (res?.error) {
      setError(res.error);
    } else {
      setNote("");
    }
    setIsSubmitting(false);
  };

  const handleConvert = async () => {
    if (!window.confirm("Are you sure you want to convert this lead to a buyer? This will add them to the buyers list and mark the lead as converted.")) {
      return;
    }
    setIsSubmitting(true);
    setError("");
    const res = await convertLeadToBuyer(lead.id);
    if (res?.error) {
      setError(res.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Lead Status Workflow</h2>
            <p className="text-sm text-ink-soft">Update where this lead is in the funnel.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={lead.status}
              onChange={handleStatusChange}
              disabled={isSubmitting || isConverted}
              className="rounded-lg border border-paper-line bg-paper-soft px-4 py-2 font-medium text-ink outline-none transition-colors focus:border-brand capitalize disabled:opacity-50"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>

            {!isConverted && (
              <button
                onClick={handleConvert}
                disabled={isSubmitting || lead.status === "lost"}
                className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Convert to Buyer
              </button>
            )}
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
      </div>

      {/* Notes Form */}
      <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-ink">Add Note</h2>
        <form onSubmit={handleAddNote} className="relative">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Log a call, summarize a WhatsApp conversation, or add a reminder..."
            className="w-full rounded-lg border border-paper-line bg-paper-soft p-4 pr-12 text-sm text-ink outline-none transition-colors focus:border-brand min-h-[100px] resize-none"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!note.trim() || isSubmitting}
            className="absolute bottom-3 right-3 rounded-md bg-brand p-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-paper-line bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-ink">Activity Timeline</h2>
        
        <div className="relative border-l border-paper-line ml-4 space-y-8 pb-4">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.activity_type] || FileText;
              return (
                <div key={activity.id} className="relative pl-6">
                  <div className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft border-4 border-white">
                    <Icon className="h-3.5 w-3.5 text-brand-dark" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink capitalize">
                        {activity.activity_type.replace(/_/g, " ")}
                      </p>
                      <span className="text-xs text-ink-soft">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    {activity.note && (
                      <p className="mt-1 text-sm text-ink bg-paper-soft p-3 rounded-lg border border-paper-line inline-block max-w-full">
                        {activity.note}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
                      <User className="h-3 w-3" />
                      <span>{activity.admin?.name || activity.admin?.email || "System"}</span>
                      <span>•</span>
                      <span>{format(new Date(activity.created_at), "MMM d, yyyy h:mm a")}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="pl-6 text-sm text-ink-soft italic">
              No activity recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
