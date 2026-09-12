import { handleBugReportRequest } from "@/lib/bug-report";

export function POST(request: Request) {
  return handleBugReportRequest(request);
}
