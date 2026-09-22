import { Timestamp } from "firebase/firestore";
import { describe, expect, it } from "vitest";
import { getTaskDateStr } from "../utils/dateHelpers";

describe("getTaskDateStr", () => {
    const date = new Date("2026-09-21T12:00:00.000Z");

    it("normaliza strings, números, Date y Timestamp", () => {
        expect(getTaskDateStr("2026-09-21T12:00:00.000Z")).toBe("2026-09-21");
        expect(getTaskDateStr(date.getTime())).toBe("2026-09-21");
        expect(getTaskDateStr(date)).toBe("2026-09-21");
        expect(getTaskDateStr(Timestamp.fromDate(date))).toBe("2026-09-21");
    });

    it("devuelve undefined para valores vacíos", () => {
        expect(getTaskDateStr(null)).toBeUndefined();
        expect(getTaskDateStr(undefined)).toBeUndefined();
    });

    it("devuelve undefined si toDate lanza un error", () => {
        const invalidTimestamp = { toDate: () => { throw new Error("Invalid timestamp"); } };

        expect(getTaskDateStr(invalidTimestamp as never)).toBeUndefined();
    });
});
