"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type Tables } from "@/types/supabase";

export function useRealtimeIncidents() {
  const [incidents, setIncidents] = useState<Tables<"incidents">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let isActive = true;
    // Events may arrive while the initial query is in flight. Keep the latest
    // version of each changed record so a slower query cannot put stale rows
    // back into state.
    const realtimeChanges = new Map<string, Tables<"incidents"> | null>();

    const applyIncidentChange = (record: Tables<"incidents">) => {
      setIncidents((previous) => {
        if (record.status === "resolved") {
          return previous.filter((incident) => incident.id !== record.id);
        }

        const withoutRecord = previous.filter((incident) => incident.id !== record.id);
        return [record, ...withoutRecord].sort(
          (a, b) => new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime(),
        );
      });
    };

    async function fetchInitialIncidents() {
      try {
        setLoading(true);
        // Fetch incidents that are not resolved (status is 'open' or 'assigned')
        const { data, error: fetchError } = await supabase
          .from("incidents")
          .select("*")
          .neq("status", "resolved")
          .order("reported_at", { ascending: false });

        if (fetchError) throw fetchError;
        if (!isActive) return;

        const merged = new Map((data ?? []).map((incident) => [incident.id, incident]));
        realtimeChanges.forEach((record, id) => {
          if (record === null || record.status === "resolved") {
            merged.delete(id);
          } else {
            merged.set(id, record);
          }
        });
        setIncidents(
          [...merged.values()].sort(
            (a, b) => new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime(),
          ),
        );
      } catch (err) {
        if (!isActive) return;
        console.error("Error fetching initial incidents:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isActive) setLoading(false);
      }
    }

    fetchInitialIncidents();

    // Subscribe to INSERT and UPDATE events on the incidents table
    const channel = supabase
      .channel("realtime-incidents-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "incidents",
          filter: "status=neq.resolved",
        },
        (payload) => {
          if (!isActive) return;

          if (payload.eventType === "INSERT") {
            const newRecord = payload.new as Tables<"incidents">;
            realtimeChanges.set(newRecord.id, newRecord);
            if (newRecord.status !== "resolved") {
              applyIncidentChange(newRecord);
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedRecord = payload.new as Tables<"incidents">;
            realtimeChanges.set(updatedRecord.id, updatedRecord);
            applyIncidentChange(updatedRecord);
          } else if (payload.eventType === "DELETE") {
            const oldRecord = payload.old as Partial<Tables<"incidents">>;
            if (oldRecord.id) {
              realtimeChanges.set(oldRecord.id, null);
              setIncidents((prev) => prev.filter((item) => item.id !== oldRecord.id));
            }
          }
        }
      )
      .subscribe((status, subscribeError) => {
        if (isActive && (subscribeError || status === "CHANNEL_ERROR" || status === "TIMED_OUT")) {
          console.error("Real-time incidents subscription failed:", subscribeError);
          setError(
            subscribeError instanceof Error
              ? subscribeError
              : new Error("The incident live-update connection was lost."),
          );
        }
      });

    return () => {
      isActive = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return { incidents, loading, error };
}
