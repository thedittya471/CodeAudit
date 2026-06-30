import { getServerSession } from "@/features/auth/actions";
import { getUserInstallationId } from "@/features/github/server/installation";
import { getInstallationSyncStatuses } from "@/features/repo-sync/server/repo-sync";
import { NextResponse } from "next/server";

// Always run fresh — this is polled for live status, never cache it.
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const installationId = await getUserInstallationId(session.user.id);

  if (!installationId) {
    return NextResponse.json({ statuses: {} }, { headers: { "Cache-Control": "no-store" } });
  }

  const statuses = await getInstallationSyncStatuses(installationId);

  return NextResponse.json({ statuses }, { headers: { "Cache-Control": "no-store" } });
}
