import { getInitialAuthState } from "@/lib/utils/getInitialAuthState";
import AuthInitializer from "@/components/_layout/authInitializer";
import AuthGuard from "@/components/_layout/authGuard";
import ConditionalLayout from "@/components/_layout/conditionalLayout";

export default async function AuthWrapper({ 
    children,
}: { 
    children: React.ReactNode;
}) {
  const initialUser = await getInitialAuthState();

  return (
    <>
      <AuthInitializer initialUser={initialUser} />
      <ConditionalLayout initialUser={initialUser}>
        <AuthGuard>{children}</AuthGuard>
      </ConditionalLayout>
    </>
  );
}