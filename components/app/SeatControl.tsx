"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { changeSeatsAction } from "@/lib/billing/actions";

/** Add or remove seats on a team's plan. Owners only. */
export function SeatControl({ seats, used, minSeats }: { seats: number; used: number; minSeats: number }) {
  const router = useRouter();
  const [value, setValue] = useState(seats);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        setDone(false);
        startTransition(async () => {
          const result = await changeSeatsAction({ seats: value });
          if (result.ok) {
            setDone(true);
            router.refresh();
          } else setError(result.error);
        });
      }}
    >
      <label className="flex flex-col gap-1.5 text-sm font-medium text-navy-900">
        Seats
        <input
          type="number"
          min={minSeats}
          max={200}
          value={value}
          onChange={(event) => setValue(Number(event.target.value) || minSeats)}
          className="w-24 rounded-lg border border-ink-300 px-3 py-2 text-right font-normal"
        />
      </label>
      <button
        type="submit"
        disabled={pending || value === seats}
        className="rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
      >
        Update seats
      </button>
      <p className="text-xs text-ink-600">
        {used} of {seats} in use. The smallest team is {minSeats} seats.
      </p>
      {done && !error && (
        <p role="status" className="text-sm text-navy-900">
          Seats updated.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
