import { Suspense } from "react";
import { AuthSignInFeature } from "@features/auth";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#ff8c42] border-t-transparent" />
        </div>
      }
    >
      <AuthSignInFeature />
    </Suspense>
  );
}
