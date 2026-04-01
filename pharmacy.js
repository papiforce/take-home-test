export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const strategies = {
  "Herbal Tea"(drug) {
    drug.benefit += drug.expiresIn <= 0 ? 2 : 1;
    drug.expiresIn -= 1;
  },

  "Magic Pill"() {},

  Fervex(drug) {
    if (drug.expiresIn <= 0) {
      drug.benefit = 0;
    } else if (drug.expiresIn <= 5) {
      drug.benefit += 3;
    } else if (drug.expiresIn <= 10) {
      drug.benefit += 2;
    } else {
      drug.benefit += 1;
    }

    drug.expiresIn -= 1;
  },
};

const defaultStrategy = (drug) => {
  drug.benefit -= drug.expiresIn <= 0 ? 2 : 1;
  drug.expiresIn -= 1;
};

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }

  updateBenefitValue() {
    for (const drug of this.drugs) {
      const strategy = strategies[drug.name] || defaultStrategy;
      strategy(drug);
      drug.benefit = clamp(drug.benefit, 0, 50);
    }

    return this.drugs;
  }
}
