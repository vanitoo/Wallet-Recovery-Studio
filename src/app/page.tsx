import { AppHeader } from "@/components/layout/app-header";
import { RecoveryWorkspace } from "@/features/recovery-session/components/recovery-workspace";

export default function Home() {
  return (
    <div className="app-shell">
      <AppHeader />
      <RecoveryWorkspace />
      <footer>Wallet Recovery Studio · Локальная open-source диагностика</footer>
    </div>
  );
}
