"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type Tables } from "@/types/supabase";

export function useRealtimeZones() {
  const [zones, setZones] = useState<Tables<"zones">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let isActive = true;
    const realtimeChanges = new Map<string, Tables<"zones">>();

    async function fetchInitialZones() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("zones")
          .select("*")
          .order("name", { ascending: true });

        if (fetchError) throw fetchError;
        if (!isActive) return;
        const merged = new Map((data ?? []).map((zone) => [zone.id, zone]));
        realtimeChanges.forEach((zone, id) => merged.set(id, zone));
        setZones([...merged.values()].sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        if (!isActive) return;
        console.error("Error fetching initial zones:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isActive) setLoading(false);
      }
    }

    fetchInitialZones();

    // Subscribe to UPDATE events on the zones table
    const channel = supabase
      .channel("realtime-zones-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "zones",
        },
        (payload) => {
          if (!isActive) return;
          const updatedRecord = payload.new as Tables<"zones">;
          realtimeChanges.set(updatedRecord.id, updatedRecord);
          setZones((prev) => {
            const next = new Map(prev.map((zone) => [zone.id, zone]));
            next.set(updatedRecord.id, updatedRecord);
            return [...next.values()].sort((a, b) => a.name.localeCompare(b.name));
          });
        }
      )
      .subscribe((status, subscribeError) => {
        if (isActive && (subscribeError || status === "CHANNEL_ERROR" || status === "TIMED_OUT")) {
          console.error("Real-time zones subscription failed:", subscribeError);
          setError(
            subscribeError instanceof Error
              ? subscribeError
              : new Error("The zone live-update connection was lost."),
          );
        }
      });

    return () => {
      isActive = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return { zones, loading, error };
}
