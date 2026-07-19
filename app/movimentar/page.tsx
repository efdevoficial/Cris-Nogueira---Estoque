import AppShell from "@/components/AppShell";
import MovementForm from "@/components/MovementForm";

export default function MovementPage() {
  return (
    <AppShell>
      <header className="topbar">
        <div><h2>Bipar produto</h2><p>Registre entradas e saídas usando o leitor USB.</p></div>
      </header>
      <MovementForm />
    </AppShell>
  );
}
