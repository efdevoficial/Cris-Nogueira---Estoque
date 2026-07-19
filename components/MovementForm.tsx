"use client";

import { useEffect, useRef, useState } from "react";

type Product = {
  id: number;
  barcode: string;
  name: string;
  size: string | null;
  color: string | null;
  quantity: number;
};

export default function MovementForm() {
  const barcodeRef = useRef<HTMLInputElement>(null);
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => barcodeRef.current?.focus(), []);

  async function searchProduct(code = barcode) {
    const clean = code.trim();
    if (!clean) return;
    setLoading(true);
    setMessage("");
    const response = await fetch(`/api/produtos/buscar?barcode=${encodeURIComponent(clean)}`);
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setProduct(null);
      setMessage(result.error || "Produto não encontrado.");
      return;
    }
    setProduct(result);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product) return;
    setLoading(true);
    const form = new FormData(event.currentTarget);
    form.set("productId", String(product.id));
    const response = await fetch("/api/movimentacoes", { method: "POST", body: form });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(result.error || "Não foi possível movimentar o estoque.");
      return;
    }

    setMessage(result.message);
    setProduct({ ...product, quantity: result.newQuantity });
    event.currentTarget.reset();
    barcodeRef.current?.focus();
  }

  return (
    <>
      <section className="panel">
        <div className="field">
          <label htmlFor="barcode">Código de barras</label>
          <input
            ref={barcodeRef}
            id="barcode"
            className="scanner"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                searchProduct();
              }
            }}
            placeholder="Bipe o produto e pressione Enter"
          />
        </div>
        <div className="actions" style={{marginTop: 12}}>
          <button className="btn secondary" type="button" onClick={() => searchProduct()} disabled={loading}>
            {loading ? "Buscando..." : "Buscar produto"}
          </button>
        </div>
      </section>

      {message && <div className={`message ${message.includes("sucesso") ? "success" : "error"}`} style={{marginTop: 18}}>{message}</div>}

      {product && (
        <form className="panel" onSubmit={submit}>
          <h3>{product.name}</h3>
          <p>Código: {product.barcode} • {[product.size, product.color].filter(Boolean).join(" • ") || "Sem variação"}</p>
          <p>Quantidade atual: <strong>{product.quantity}</strong></p>
          <div className="form-grid">
            <div className="field">
              <label>Operação</label>
              <select name="type" required>
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída / Venda</option>
              </select>
            </div>
            <div className="field"><label>Quantidade</label><input name="quantity" type="number" min="1" defaultValue="1" required /></div>
            <div className="field full"><label>Observação</label><input name="note" placeholder="Ex.: compra do fornecedor ou venda no caixa" /></div>
          </div>
          <button className="btn" style={{marginTop: 18}} disabled={loading}>
            {loading ? "Salvando..." : "Confirmar movimentação"}
          </button>
        </form>
      )}
    </>
  );
}
