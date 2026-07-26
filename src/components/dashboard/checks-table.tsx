import { StatusDot } from "@/components/dashboard/status-dot";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Check } from "@/types/database";

interface ChecksTableProps {
  checks: Check[];
}

export function ChecksTable({ checks }: ChecksTableProps) {
  if (checks.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No checks recorded yet
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Response</TableHead>
          <TableHead>Status Code</TableHead>
          <TableHead>Error</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {checks.map((check) => (
          <TableRow key={check.id}>
            <TableCell>
              <StatusDot isUp={check.is_up} />
            </TableCell>
            <TableCell className="text-sm">
              {new Date(check.checked_at).toLocaleString()}
            </TableCell>
            <TableCell className="text-sm font-mono">
              {check.response_time_ms != null ? `${check.response_time_ms}ms` : "—"}
            </TableCell>
            <TableCell className="text-sm font-mono">
              {check.status_code ?? "—"}
            </TableCell>
            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
              {check.error_message ?? "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
