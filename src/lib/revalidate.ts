import { revalidatePath } from "next/cache";

/**
 * Purges the ISR cache for every public page so dashboard edits
 * (stats, skills, experience, services, settings) appear immediately
 * on the next visit instead of waiting for the 60s revalidate window.
 */
export function revalidatePublicContent() {
  revalidatePath("/", "layout");
}
