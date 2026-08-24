"use client";

import { useActionState } from "react";
import { saveContentBlocks } from "@/app/admin/actions";
import { Flash, SaveButton } from "@/components/admin/SaveBar";
import type { ContentBlock } from "@/lib/types";

export function ContentEditor({
  grouped,
}: {
  grouped: Record<string, ContentBlock[]>;
}) {
  const [state, action] = useActionState(saveContentBlocks, null);

  return (
    <form action={action}>
      <Flash state={state} />

      {Object.entries(grouped).map(([page, blocks]) => (
        <section key={page} className="card">
          <div className="card__head">
            <h2 className="card__title">{page}</h2>
          </div>

          {blocks.map((block) => (
            <label className="f" key={block.key}>
              <span>{block.label}</span>
              {block.field_type === "textarea" ? (
                <textarea
                  name={`block:${block.key}`}
                  defaultValue={block.value}
                  rows={3}
                />
              ) : (
                <input
                  type="text"
                  name={`block:${block.key}`}
                  defaultValue={block.value}
                />
              )}
            </label>
          ))}
        </section>
      ))}

      <div style={{ position: "sticky", bottom: 0, padding: "16px 0", background: "var(--ink)" }}>
        <SaveButton label="Save all text" />
      </div>
    </form>
  );
}
