import { requireAuth } from "@/features/auth/actions";
import { DashbaordShell } from "@/features/dashboard/components/dashboard-shell"

export default async function DashbaordLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await requireAuth()

    return (
        <DashbaordShell user={session.user} plan="Pro">
            {children}
        </DashbaordShell>
    )
}