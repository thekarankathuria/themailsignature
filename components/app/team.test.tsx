import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InviteForm } from "./InviteForm";
import { TeamMembers, type MemberRow } from "./TeamMembers";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: () => {} }) }));
vi.mock("@/lib/teams/actions", () => ({
  inviteAction: vi.fn(),
  removeMemberAction: vi.fn(),
  revokeInvitationAction: vi.fn(),
  setRoleAction: vi.fn(),
}));

const members: MemberRow[] = [
  { userId: "1", email: "owner@example.com", role: "owner", emailVerified: true, isYou: true },
  { userId: "2", email: "admin@example.com", role: "admin", emailVerified: true, isYou: false },
  { userId: "3", email: "member@example.com", role: "member", emailVerified: false, isYou: false },
];

describe("TeamMembers", () => {
  it("lets an admin change other people but not themselves", () => {
    render(<TeamMembers members={members} invitations={[]} canManage canMakeOwner={false} />);

    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(2);
    // Your own row shows the role as text, with no way to change it here.
    const you = screen.getByText("owner@example.com").closest("li")!;
    expect(within(you).queryByRole("combobox")).toBeNull();
    expect(within(you).getByText("Owner")).toBeTruthy();
  });

  it("offers the owner role only to an owner", () => {
    const { unmount } = render(<TeamMembers members={members} invitations={[]} canManage canMakeOwner={false} />);
    expect(screen.queryByRole("option", { name: "Owner" })).toBeNull();
    unmount();

    render(<TeamMembers members={members} invitations={[]} canManage canMakeOwner />);
    expect(screen.getAllByRole("option", { name: "Owner" })).toHaveLength(2);
  });

  it("shows a plain list to somebody who cannot manage anyone", () => {
    render(<TeamMembers members={members} invitations={[]} canManage={false} canMakeOwner={false} />);
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(screen.queryByRole("button", { name: "Remove" })).toBeNull();
    expect(screen.getByText("Member")).toBeTruthy();
  });

  it("says who has not confirmed their email", () => {
    render(<TeamMembers members={members} invitations={[]} canManage canMakeOwner />);
    const row = screen.getByText("member@example.com").closest("li")!;
    expect(within(row).getByText(/has not confirmed their email/i)).toBeTruthy();
  });

  it("lists invitations with the seat they hold", () => {
    render(
      <TeamMembers
        members={members}
        invitations={[{ id: "i1", email: "invited@example.com", role: "member", expiresAt: "2026-10-01T00:00:00.000Z" }]}
        canManage
        canMakeOwner
      />,
    );
    expect(screen.getByText("invited@example.com")).toBeTruthy();
    expect(screen.getByText(/This seat is held until/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Take the seat back" })).toBeTruthy();
  });
});

describe("InviteForm", () => {
  it("asks for a seat before an address when the team is full", () => {
    render(<InviteForm seatsLeft={0} canMakeAdmin />);
    expect(screen.getByText(/Every seat on your plan is taken/)).toBeTruthy();
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("says how many seats are free, in the right number", () => {
    const { unmount } = render(<InviteForm seatsLeft={1} canMakeAdmin />);
    expect(screen.getByText(/1 seat is free/)).toBeTruthy();
    unmount();

    render(<InviteForm seatsLeft={3} canMakeAdmin />);
    expect(screen.getByText(/3 seats are free/)).toBeTruthy();
  });

  it("offers the admin role only when the inviter may hand it out", () => {
    const { unmount } = render(<InviteForm seatsLeft={2} canMakeAdmin={false} />);
    expect(screen.queryByRole("combobox")).toBeNull();
    unmount();

    render(<InviteForm seatsLeft={2} canMakeAdmin />);
    expect(within(screen.getByRole("combobox")).getByRole("option", { name: "Admin" })).toBeTruthy();
  });
});
