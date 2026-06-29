"use server";

import { getServerSession } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import {
  deleteInstallation,
  getUserInstallationId,
  uninstallGithubApp,
} from "../server/installation";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";



export async function disconnectGithubApp() {
    const session = await getServerSession();

    if (!session) {
      redirect("/sign-in");
    }

    const installationId = await getUserInstallationId(session.user.id);

    // Remove it from GitHub first; if that succeeds (or it's already gone),
    // clear our local record. This keeps the DB from pointing at a dead install.
    if (installationId) {
      await uninstallGithubApp(installationId);
    }

    await deleteInstallation(session.user.id);
    redirect(DASHBOARD_ROUTES.github);
  }