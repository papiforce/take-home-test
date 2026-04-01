import { Drug, Pharmacy } from "./pharmacy";

describe("Pharmacy", () => {
  const updateDrug = (name, expiresIn, benefit) => {
    const pharmacy = new Pharmacy([new Drug(name, expiresIn, benefit)]);
    return pharmacy.updateBenefitValue()[0];
  };

  describe("Normal drug", () => {
    it("should decrease benefit and expiresIn by 1", () => {
      const drug = updateDrug("Doliprane", 10, 20);
      expect(drug).toEqual(new Drug("Doliprane", 9, 19));
    });

    it("should degrade benefit twice as fast once expired", () => {
      const drug = updateDrug("Doliprane", 0, 20);
      expect(drug).toEqual(new Drug("Doliprane", -1, 18));
    });

    it("should not decrease benefit below 0", () => {
      const drug = updateDrug("Doliprane", 10, 0);
      expect(drug).toEqual(new Drug("Doliprane", 9, 0));
    });

    it("should not decrease benefit below 0 when expired", () => {
      const drug = updateDrug("Doliprane", 0, 1);
      expect(drug).toEqual(new Drug("Doliprane", -1, 0));
    });
  });

  describe("Herbal Tea", () => {
    it("should increase benefit by 1 before expiration", () => {
      const drug = updateDrug("Herbal Tea", 10, 20);
      expect(drug).toEqual(new Drug("Herbal Tea", 9, 21));
    });

    it("should increase benefit twice as fast after expiration", () => {
      const drug = updateDrug("Herbal Tea", 0, 20);
      expect(drug).toEqual(new Drug("Herbal Tea", -1, 22));
    });

    it("should not increase benefit above 50", () => {
      const drug = updateDrug("Herbal Tea", 10, 50);
      expect(drug).toEqual(new Drug("Herbal Tea", 9, 50));
    });

    it("should not increase benefit above 50 when expired", () => {
      const drug = updateDrug("Herbal Tea", 0, 49);
      expect(drug).toEqual(new Drug("Herbal Tea", -1, 50));
    });
  });

  describe("Magic Pill", () => {
    it("should never expire nor decrease in benefit", () => {
      const drug = updateDrug("Magic Pill", 10, 40);
      expect(drug).toEqual(new Drug("Magic Pill", 10, 40));
    });

    it("should never change even with high values", () => {
      const drug = updateDrug("Magic Pill", 0, 50);
      expect(drug).toEqual(new Drug("Magic Pill", 0, 50));
    });
  });

  describe("Fervex", () => {
    it("should increase benefit by 1 when more than 10 days left", () => {
      const drug = updateDrug("Fervex", 15, 20);
      expect(drug).toEqual(new Drug("Fervex", 14, 21));
    });

    it("should increase benefit by 2 when 10 days or less", () => {
      const drug = updateDrug("Fervex", 10, 20);
      expect(drug).toEqual(new Drug("Fervex", 9, 22));
    });

    it("should increase benefit by 2 when 6 days left", () => {
      const drug = updateDrug("Fervex", 6, 20);
      expect(drug).toEqual(new Drug("Fervex", 5, 22));
    });

    it("should increase benefit by 3 when 5 days or less", () => {
      const drug = updateDrug("Fervex", 5, 20);
      expect(drug).toEqual(new Drug("Fervex", 4, 23));
    });

    it("should increase benefit by 3 when 1 day left", () => {
      const drug = updateDrug("Fervex", 1, 20);
      expect(drug).toEqual(new Drug("Fervex", 0, 23));
    });

    it("should drop benefit to 0 after expiration", () => {
      const drug = updateDrug("Fervex", 0, 30);
      expect(drug).toEqual(new Drug("Fervex", -1, 0));
    });

    it("should not increase benefit above 50", () => {
      const drug = updateDrug("Fervex", 5, 49);
      expect(drug).toEqual(new Drug("Fervex", 4, 50));
    });
  });

  describe("Dafalgan", () => {
    it("should degrade benefit twice as fast as normal", () => {
      const drug = updateDrug("Dafalgan", 10, 20);
      expect(drug).toEqual(new Drug("Dafalgan", 9, 18));
    });

    it("should degrade benefit 4x when expired (twice as fast × expired)", () => {
      const drug = updateDrug("Dafalgan", 0, 20);
      expect(drug).toEqual(new Drug("Dafalgan", -1, 16));
    });

    it("should not decrease benefit below 0", () => {
      const drug = updateDrug("Dafalgan", 10, 1);
      expect(drug).toEqual(new Drug("Dafalgan", 9, 0));
    });

    it("should not decrease benefit below 0 when expired", () => {
      const drug = updateDrug("Dafalgan", 0, 3);
      expect(drug).toEqual(new Drug("Dafalgan", -1, 0));
    });
  });

  describe("Edge cases", () => {
    it("should handle benefit already at 0 for normal drug", () => {
      const drug = updateDrug("Doliprane", -1, 0);
      expect(drug).toEqual(new Drug("Doliprane", -2, 0));
    });

    it("should handle multiple drugs at once", () => {
      const pharmacy = new Pharmacy([
        new Drug("Doliprane", 5, 10),
        new Drug("Herbal Tea", 3, 8),
        new Drug("Magic Pill", 0, 40),
      ]);
      const drugs = pharmacy.updateBenefitValue();
      expect(drugs).toEqual([
        new Drug("Doliprane", 4, 9),
        new Drug("Herbal Tea", 2, 9),
        new Drug("Magic Pill", 0, 40),
      ]);
    });

    it("should handle empty pharmacy", () => {
      const pharmacy = new Pharmacy([]);
      expect(pharmacy.updateBenefitValue()).toEqual([]);
    });
  });
});
