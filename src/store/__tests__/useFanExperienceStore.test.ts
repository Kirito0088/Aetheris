import { describe, it, expect, beforeEach } from "vitest";
import { useFanExperienceStore } from "@/store/useFanExperienceStore";

const initialState = useFanExperienceStore.getInitialState();

beforeEach(() => {
  useFanExperienceStore.setState(initialState);
});

describe("useFanExperienceStore", () => {
  describe("initial state", () => {
    it("has null activeZoneId", () => {
      expect(useFanExperienceStore.getState().activeZoneId).toBeNull();
    });

    it("has 5 initial zones", () => {
      const zones = useFanExperienceStore.getState().zones;
      expect(Object.keys(zones)).toHaveLength(5);
    });

    it("has initial zone densities", () => {
      const zones = useFanExperienceStore.getState().zones;
      expect(zones["north-gate"].density).toBe("high");
      expect(zones["south-gate"].density).toBe("low");
      expect(zones["sector-104"].density).toBe("medium");
      expect(zones["vip-lounge"].density).toBe("low");
      expect(zones["concourse-east"].density).toBe("critical");
    });

    it("has 1 initial alert", () => {
      expect(useFanExperienceStore.getState().alerts).toHaveLength(1);
      expect(useFanExperienceStore.getState().alerts[0].id).toBe("alert-1");
    });
  });

  describe("setActiveZone", () => {
    it("sets active zone", () => {
      useFanExperienceStore.getState().setActiveZone("north-gate");
      expect(useFanExperienceStore.getState().activeZoneId).toBe("north-gate");
    });

    it("clears active zone with null", () => {
      useFanExperienceStore.getState().setActiveZone("north-gate");
      useFanExperienceStore.getState().setActiveZone(null);
      expect(useFanExperienceStore.getState().activeZoneId).toBeNull();
    });
  });

  describe("updateZoneDensity", () => {
    it("updates density for existing zone", () => {
      useFanExperienceStore.getState().updateZoneDensity("north-gate", "low");
      expect(useFanExperienceStore.getState().zones["north-gate"].density).toBe("low");
    });

    it("is no-op for unknown zone", () => {
      const before = { ...useFanExperienceStore.getState().zones };
      useFanExperienceStore.getState().updateZoneDensity("unknown", "low");
      expect(useFanExperienceStore.getState().zones).toEqual(before);
    });
  });

  describe("dismissAlert", () => {
    it("removes alert by ID", () => {
      useFanExperienceStore.getState().dismissAlert("alert-1");
      expect(useFanExperienceStore.getState().alerts).toHaveLength(0);
    });

    it("does not affect other alerts when dismissing unknown ID", () => {
      useFanExperienceStore.getState().dismissAlert("nonexistent");
      expect(useFanExperienceStore.getState().alerts).toHaveLength(1);
    });
  });

  describe("setTicket", () => {
    it("replaces the ticket", () => {
      const newTicket = {
        match: "Brazil vs Germany",
        date: "July 10, 2026",
        gate: "Gate A",
        sector: "200",
        row: "B",
        seat: "5",
        kickoffTime: new Date().toISOString(),
      };
      useFanExperienceStore.getState().setTicket(newTicket);
      expect(useFanExperienceStore.getState().ticket.match).toBe("Brazil vs Germany");
    });
  });

  describe("setAlerts", () => {
    it("replaces all alerts", () => {
      const newAlerts = [
        { id: "new-1", title: "New Alert", description: "Test", type: "info" as const },
        { id: "new-2", title: "Urgent", description: "Urgent test", type: "urgent" as const },
      ];
      useFanExperienceStore.getState().setAlerts(newAlerts);
      expect(useFanExperienceStore.getState().alerts).toHaveLength(2);
      expect(useFanExperienceStore.getState().alerts[0].id).toBe("new-1");
    });
  });
});
