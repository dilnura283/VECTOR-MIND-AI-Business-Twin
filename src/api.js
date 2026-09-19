import { computeCreditScore, matchBanks } from "./lib/scoring.js";
import { banks } from "./lib/banks.js";
import { buildProjection, buildPersonas } from "./lib/projection.js";
import { roadmap } from "./lib/roadmap.js";

const API_BASE_URL = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) || "";

function delay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestJson(url, options = {}, fallback) {
  if (!API_BASE_URL) {
    return fallback();
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[api] ${url} failed, using local fallback:`, error);
    return fallback();
  }
}

export const api = {
  async getScore(payload) {
    const fallback = async () => {
      await delay();
      if (typeof payload.monthlyRevenue !== "number" || payload.monthlyRevenue < 0) {
        throw new Error("monthlyRevenue son bo'lishi va manfiy bo'lmasligi kerak");
      }
      const result = computeCreditScore(payload);
      const bankMatches = matchBanks(result.score, payload, banks);
      return { ...result, banks: bankMatches };
    };

    if (!API_BASE_URL) {
      return fallback();
    }

    return requestJson("/score", {
      method: "POST",
      body: JSON.stringify(payload)
    }, fallback);
  },

  async getBanks() {
    const fallback = async () => {
      await delay();
      return banks.map(({ id, name, minScore, minMonthlyRevenue, minBusinessAgeMonths, rate, reqs }) => ({
        id, name, minScore, minMonthlyRevenue, minBusinessAgeMonths, rate, reqs
      }));
    };

    if (!API_BASE_URL) {
      return fallback();
    }

    return requestJson("/banks", { method: "GET" }, fallback);
  },

  async getProjection(payload) {
    const fallback = async () => {
      await delay();
      if (typeof payload.baseRevenue !== "number" || payload.baseRevenue <= 0) {
        throw new Error("baseRevenue musbat son bo'lishi kerak");
      }
      return buildProjection(payload);
    };

    if (!API_BASE_URL) {
      return fallback();
    }

    return requestJson("/projection", {
      method: "POST",
      body: JSON.stringify(payload)
    }, fallback);
  },

  async getPersonas(industry) {
    const fallback = async () => {
      await delay();
      return buildPersonas(industry);
    };

    if (!API_BASE_URL) {
      return fallback();
    }

    return requestJson(`/personas?industry=${encodeURIComponent(industry ?? "other")}`, { method: "GET" }, fallback);
  },

  async getAutofill() {
    const fallback = async () => {
      await delay();
      return {
        businessName: "Zamin Market",
        industry: "savdo",
        monthlyRevenue: 32_000_000,
        businessAgeMonths: 14,
        monthlyDebtPayments: 4_000_000,
        hasCollateral: true,
        latePayments: 0
      };
    };

    if (!API_BASE_URL) {
      return fallback();
    }

    return requestJson("/autofill", { method: "GET" }, fallback);
  },

  async getRoadmap() {
    const fallback = async () => {
      await delay();
      return roadmap;
    };

    if (!API_BASE_URL) {
      return fallback();
    }

    return requestJson("/roadmap", { method: "GET" }, fallback);
  }
};