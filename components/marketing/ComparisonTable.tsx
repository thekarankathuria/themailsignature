import type { Cell, ComparisonRow } from "@/lib/pricing";

function CellValue({ value }: { value: Cell }) {
  if (value === true) return <><span aria-hidden="true" className="font-bold text-blue-brand-600">✓</span><span className="sr-only">Included</span></>;
  if (value === false) return <><span aria-hidden="true" className="text-ink-300">—</span><span className="sr-only">Not included</span></>;
  return <span className="text-navy-900">{value}</span>;
}

export function ComparisonTable({ groups }: { groups: Array<{ category: string; rows: ComparisonRow[] }> }) {
  return (
    <div className="overflow-x-auto rounded-card border border-ink-200 bg-white">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="sr-only">Feature comparison of the Free, Pro and Business plans</caption>
        <thead>
          <tr className="border-b border-ink-200">
            <th scope="col" className="p-4 font-semibold text-ink-500">Feature</th>
            {["Free", "Pro", "Business"].map((name) => (
              <th key={name} scope="col" className="p-4 text-center font-semibold text-navy-900">{name}</th>
            ))}
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.category}>
            <tr className="bg-navy-50">
              <th scope="colgroup" colSpan={4} className="px-4 py-2 font-semibold text-navy-900">{group.category}</th>
            </tr>
            {group.rows.map((row) => (
              <tr key={row.label} className="border-t border-ink-100">
                <th scope="row" className="p-4 font-normal text-ink-700">{row.label}</th>
                <td className="p-4 text-center"><CellValue value={row.free} /></td>
                <td className="p-4 text-center"><CellValue value={row.pro} /></td>
                <td className="p-4 text-center"><CellValue value={row.business} /></td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
