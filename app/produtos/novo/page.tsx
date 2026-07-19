import AppShell from "@/components/AppShell";
import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <AppShell>
      <header className="topbar"><div><h2>Novo produto</h2><p>Bipe o código e preencha os dados da peça.</p></div></header>
      <ProductForm />
    </AppShell>
  );
}
