import { describe, it, expect } from "vitest";

/**
 * Test to validate API_FOOTBALL_KEY is working correctly
 * This test fetches the Libertadores 2025 league info to verify the API key
 */
describe("API-Football Integration", () => {
  it("should validate API_FOOTBALL_KEY by fetching Libertadores league data", async () => {
    const apiKey = process.env.API_FOOTBALL_KEY;
    
    if (!apiKey) {
      throw new Error("API_FOOTBALL_KEY environment variable is not set");
    }

    try {
      // Fetch Libertadores 2025 league info to validate the API key
      const response = await fetch(
        "https://v3.football.api-sports.io/leagues?name=Copa%20Libertadores&season=2025",
        {
          headers: {
            "x-apisports-key": apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Verify the response has the expected structure
      expect(data).toHaveProperty("response");
      expect(Array.isArray(data.response)).toBe(true);
      
      if (data.response.length === 0) {
        throw new Error("No Libertadores league found in API response");
      }

      const libertadores = data.response[0];
      expect(libertadores).toHaveProperty("id");
      expect(libertadores).toHaveProperty("name");
      expect(libertadores.name).toContain("Libertadores");

      console.log(`✅ API-Football key validated successfully!`);
      console.log(`   League: ${libertadores.name}`);
      console.log(`   Season: ${libertadores.seasons?.[0]?.year || "N/A"}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`API-Football validation failed: ${message}`);
    }
  });
});


