import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PLANS } from "@/lib/pricing";
import { PricingCards, annualMonthly } from "./PricingCards";

describe("PricingCards", () => {
  it("shows monthly prices by default", () => {
    render(<PricingCards plans={PLANS} />);
    const pro = screen.getByRole("article", { name: "Pro" });
    expect(within(pro).getByText("$5")).toBeInTheDocument();
  });

  it("switches to the annual price per month", () => {
    render(<PricingCards plans={PLANS} />);
    fireEvent.click(screen.getByRole("radio", { name: /yearly/i }));
    const pro = screen.getByRole("article", { name: "Pro" });
    expect(within(pro).getByText("$4")).toBeInTheDocument();
    expect(within(pro).getByText(/\$48 billed yearly/)).toBeInTheDocument();
  });

  it("states the Business seat minimum", () => {
    render(<PricingCards plans={PLANS} />);
    const business = screen.getByRole("article", { name: "Business" });
    expect(within(business).getByText(/minimum 3 seats/i)).toBeInTheDocument();
  });

  it("links each plan to its call to action", () => {
    render(<PricingCards plans={PLANS} />);
    for (const plan of PLANS) {
      const card = screen.getByRole("article", { name: plan.name });
      expect(within(card).getByRole("link", { name: plan.cta.label })).toHaveAttribute("href", plan.cta.href);
    }
  });
});

describe("annualMonthly", () => {
  it("divides the yearly price by twelve", () => {
    expect(annualMonthly({ ...PLANS[1], annual: 48 })).toBe(4);
    expect(annualMonthly({ ...PLANS[2], annual: 38 })).toBe(3.17);
  });
});
