import { deleteInquiry, toggleInquiryRead } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";
import type { Inquiry } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  const inquiries = (data ?? []) as Inquiry[];

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Inquiries</h1>
      </div>
      <p className="admin__lede">
        Submissions from the form on the Packages page, newest first.
      </p>

      {inquiries.length === 0 ? (
        <div className="empty">No inquiries yet.</div>
      ) : (
        inquiries.map((inquiry) => (
          <article
            key={inquiry.id}
            className={`inq ${inquiry.is_read ? "" : "inq--unread"}`.trim()}
          >
            <div className="inq__top">
              <div className="inq__name">{inquiry.name}</div>
              <div className="inq__date">{formatDate(inquiry.created_at)}</div>
            </div>

            <div className="inq__meta">
              {inquiry.email && <span>Email: {inquiry.email}</span>}
              {inquiry.phone && <span>Phone: {inquiry.phone}</span>}
              {inquiry.event_date && <span>Date: {inquiry.event_date}</span>}
              {inquiry.location && <span>Location: {inquiry.location}</span>}
              {inquiry.package && <span>Package: {inquiry.package}</span>}
            </div>

            {inquiry.message && <p className="inq__msg">{inquiry.message}</p>}

            <div className="row-actions">
              <form action={toggleInquiryRead}>
                <input type="hidden" name="id" value={inquiry.id} />
                <input
                  type="hidden"
                  name="is_read"
                  value={String(!inquiry.is_read)}
                />
                <button type="submit" className="b b--sm">
                  Mark as {inquiry.is_read ? "unread" : "read"}
                </button>
              </form>

              <form action={deleteInquiry}>
                <input type="hidden" name="id" value={inquiry.id} />
                <button type="submit" className="b b--sm b--danger">
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))
      )}
    </>
  );
}
