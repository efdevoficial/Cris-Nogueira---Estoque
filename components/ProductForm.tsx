type Product = {
  id?: number;
  barcode?: string;
  name?: string;
  category?: string | null;
  size?: string | null;
  color?: string | null;
  cost_price?: string | number;
  sale_price?: string | number;
  quantity?: number;
  minimum_stock?: number;
  notes?: string | null;
};

export default function ProductForm({ product }: { product?: Product }) {
  const editing = Boolean(product?.id);
  return (
    <form className="panel" method="post" action={editing ? `/api/produtos/${product?.id}` : "/api/produtos"}>
      <div className="form-grid">
        <div className="field">
          <label>Código de barras *</label>
          <input className="scanner" name="barcode" required autoFocus defaultValue={product?.barcode} placeholder="Bipe ou digite o código" />
        </div>
        <div className="field">
          <label>Nome do produto *</label>
          <input name="name" required defaultValue={product?.name} />
        </div>
        <div className="field"><label>Categoria</label><input name="category" defaultValue={product?.category ?? ""} /></div>
        <div className="field"><label>Tamanho</label><input name="size" defaultValue={product?.size ?? ""} /></div>
        <div className="field"><label>Cor</label><input name="color" defaultValue={product?.color ?? ""} /></div>
        <div className="field"><label>Preço de custo</label><input name="costPrice" type="number" min="0" step="0.01" defaultValue={product?.cost_price ?? 0} /></div>
        <div className="field"><label>Preço de venda</label><input name="salePrice" type="number" min="0" step="0.01" defaultValue={product?.sale_price ?? 0} /></div>
        {!editing && <div className="field"><label>Quantidade inicial</label><input name="quantity" type="number" min="0" defaultValue={0} /></div>}
        <div className="field"><label>Estoque mínimo</label><input name="minimumStock" type="number" min="0" defaultValue={product?.minimum_stock ?? 1} /></div>
        <div className="field full"><label>Observações</label><textarea name="notes" rows={4} defaultValue={product?.notes ?? ""} /></div>
      </div>
      <div className="actions" style={{marginTop: 20}}>
        <button className="btn" type="submit">{editing ? "Salvar alterações" : "Cadastrar produto"}</button>
        <a className="btn secondary" href="/produtos">Cancelar</a>
      </div>
    </form>
  );
}
