"use client";

import { useState, useTransition } from "react";
import { submitInquiry } from "@/app/actions";

export function InquiryForm({
  packages,
  thanksTitle,
  thanksBody,
}: {
  packages: string[];
  thanksTitle: string;
  thanksBody: string;
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (sent) {
    return (
      <div className="form-thanks">
        <div>
          <div className="form-thanks__title">{thanksTitle}</div>
          <p className="form-thanks__body">{thanksBody}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setError(null);
        startTransition(async () => {
          const result = await submitInquiry(data);
          if (result.ok) setSent(true);
          else setError(result.error);
        });
      }}
    >
      <div className="field">
        <label htmlFor="name">Full Name</label>
        <input id="name" name="name" required placeholder="Amelia Tan" />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="amelia@email.com"
        />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+60 12-345 6789"
        />
      </div>

      <div className="field">
        <label htmlFor="event_date">Event Date</label>
        <input id="event_date" name="event_date" type="date" />
      </div>

      <div className="field">
        <label htmlFor="location">Event Location</label>
        <input
          id="location"
          name="location"
          placeholder="e.g. Pullman Kuching, Damai Beach Resort"
        />
      </div>

      <div className="field">
        <label htmlFor="package">Package</label>
        <select id="package" name="package" defaultValue="">
          <option value="">Select a package</option>
          {packages.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
          <option value="Not sure yet">Not sure yet</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="A little about your day..."
        />
      </div>

      {/* Honeypot — visually hidden, never focusable. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      {error && <p className="form__error">{error}</p>}

      <button
        type="submit"
        className="btn btn--solid btn--block"
        style={{ padding: 17, marginTop: 10 }}
        disabled={pending}
      >
        {pending ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}
