import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Incident } from "@/types/database";

interface IncidentsTableProps {
  incidents: Incident[];
}

export function IncidentsTable({ incidents }: IncidentsTableProps) {
  if (incidents.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No incidents recorded
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Started</TableHead>
          <TableHead>Resolved</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((inc) => {
          const duration =
            inc.duration_seconds != null
              ? formatDuration(inc.duration_seconds)
              : "Ongoing";

          return (
            <TableRow key={inc.id}>
              <TableCell>
                {inc.resolved_at ? (
                  <Badge
                    variant="outline"
                    className="border-success/30 bg-success/10 text-success"
                  >
                    Resolved
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-destructive/30 bg-destructive/10 text-destructive"
                  >
                    Ongoing
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {new Date(inc.started_at).toLocaleString()}
              </TableCell>
              <TableCell className="text-sm">
                {inc.resolved_at
                  ? new Date(inc.resolved_at).toLocaleString()
                  : "—"}
              </TableCell>
              <TableCell className="text-sm font-mono">{duration}</TableCell>
              <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                {inc.reason ?? "—"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
