"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useFormStatus } from "react-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon } from "@hugeicons/core-free-icons"
import { signInWithGithub } from "../actions"

function SubmitButton() {
    const { pending } = useFormStatus()

    let buttonLabel = "Continue with GitHub"
    let buttonIcon = <HugeiconsIcon icon={GithubIcon} />

    if (pending) {
        buttonLabel = "Redirecting to GitHub..."
        buttonIcon = <Spinner className="size-4" />
    }

    return (
        <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={pending}
        >
            {buttonIcon}
            {buttonLabel}
        </Button>
    )
}

type GithubSignInFormProps = {
    /** Optional post-login redirect path (e.g. GitHub install callback). */
    callbackUrl?: string
}


export function GithubSignInForm({ callbackUrl }: GithubSignInFormProps) {
    return (
        <form action={signInWithGithub} className="w-full">
            {callbackUrl ? (
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
            ) : null}
            <SubmitButton />
        </form>
    )
}