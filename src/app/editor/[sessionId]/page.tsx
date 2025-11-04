import { Id } from "../../../../convex/_generated/dataModel";
import SessionUI from "./_components/SessionUI";

interface SessionPageProps {
  params: Promise<{
    sessionId: Id<"sessions">;
  }>;
}

/**
 * This is the main server component for a live session.
 * Its only job is to get the sessionId from the URL params
 * and pass it to the client-side SessionUI component.
 */
export default async function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = await params;
  return <SessionUI sessionId={sessionId} />;
}