import { describe, it, expect, beforeEach, vi } from "vitest";
import { useDatabaseStore } from "@/store/useDatabaseStore";

const initialState = useDatabaseStore.getInitialState();

beforeEach(() => {
  useDatabaseStore.setState(initialState);
  vi.restoreAllMocks();
});

describe("useDatabaseStore", () => {
  describe("initial state", () => {
    it("has seed tickets", () => {
      const state = useDatabaseStore.getState();
      expect(state.tickets["ticket-1"]).toBeDefined();
      expect(state.tickets["ticket-1"].match).toBe("Mexico vs Argentina");
    });

    it("has seed zones", () => {
      const state = useDatabaseStore.getState();
      expect(Object.keys(state.zones)).toHaveLength(5);
      expect(state.zones["north-gate"]).toBeDefined();
      expect(state.zones["south-gate"]).toBeDefined();
      expect(state.zones["sector-104"]).toBeDefined();
      expect(state.zones["vip-lounge"]).toBeDefined();
      expect(state.zones["concourse-east"]).toBeDefined();
    });

    it("has seed incidents", () => {
      const state = useDatabaseStore.getState();
      expect(state.incidents["inc-1"]).toBeDefined();
      expect(state.incidents["inc-1"].priority).toBe("high");
    });

    it("has seed tasks", () => {
      const state = useDatabaseStore.getState();
      expect(state.tasks["task-1"]).toBeDefined();
      expect(state.tasks["task-2"]).toBeDefined();
    });
  });

  describe("updateZoneMetric", () => {
    it("updates existing zone throughput and density", () => {
      useDatabaseStore.getState().updateZoneMetric("north-gate", 200, "critical");
      const zone = useDatabaseStore.getState().zones["north-gate"];
      expect(zone.metrics.throughput).toBe(200);
      expect(zone.crowdDensity).toBe("critical");
    });

    it("is no-op for unknown zone ID", () => {
      const before = { ...useDatabaseStore.getState().zones };
      useDatabaseStore.getState().updateZoneMetric("unknown-zone", 100, "low");
      const after = useDatabaseStore.getState().zones;
      expect(after).toEqual(before);
    });
  });

  describe("reportIncident", () => {
    it("creates a new incident and returns its ID", () => {
      vi.spyOn(Date, "now").mockReturnValue(1234567890);
      const id = useDatabaseStore.getState().reportIncident({
        title: "Test Incident",
        description: "A test incident",
        status: "open",
        priority: "medium",
        locationZoneId: "south-gate",
      });
      expect(id).toBe("inc-1234567890");
      expect(useDatabaseStore.getState().incidents[id]).toBeDefined();
    });

    it("sets reportedAt as ISO string", () => {
      vi.spyOn(Date, "now").mockReturnValue(1234567890);
      const id = useDatabaseStore.getState().reportIncident({
        title: "Test",
        description: "Test",
        status: "open",
        priority: "low",
        locationZoneId: "vip-lounge",
      });
      const incident = useDatabaseStore.getState().incidents[id];
      expect(incident.reportedAt).toBeDefined();
      // Should be a valid ISO date string
      expect(() => new Date(incident.reportedAt)).not.toThrow();
    });
  });

  describe("acceptTask", () => {
    it("sets status to active and assigns volunteer", () => {
      useDatabaseStore.getState().acceptTask("task-1", "volunteer-42");
      const task = useDatabaseStore.getState().tasks["task-1"];
      expect(task.status).toBe("active");
      expect(task.assignedTo).toBe("volunteer-42");
    });

    it("is no-op for unknown taskId", () => {
      const before = { ...useDatabaseStore.getState().tasks };
      useDatabaseStore.getState().acceptTask("unknown-task", "vol-1");
      const after = useDatabaseStore.getState().tasks;
      expect(after).toEqual(before);
    });
  });

  describe("completeTask", () => {
    it("sets status to completed", () => {
      useDatabaseStore.getState().acceptTask("task-2", "volunteer-1");
      useDatabaseStore.getState().completeTask("task-2");
      expect(useDatabaseStore.getState().tasks["task-2"].status).toBe("completed");
    });

    it("is no-op for unknown taskId", () => {
      const before = { ...useDatabaseStore.getState().tasks };
      useDatabaseStore.getState().completeTask("unknown-task");
      const after = useDatabaseStore.getState().tasks;
      expect(after).toEqual(before);
    });
  });
});
