import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  const suppliedKey = request.headers.get("x-setup-key");
  if (!process.env.SETUP_KEY || suppliedKey !== process.env.SETUP_KEY) {
    return NextResponse.json({ error: "Chave de instalação inválida." }, { status: 401 });
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Administradora";

  if (!adminEmail || !adminPassword || adminPassword.length < 8) {
    return NextResponse.json(
      { error: "Configure ADMIN_EMAIL e ADMIN_PASSWORD com pelo menos 8 caracteres." },
      { status: 400 }
    );
  }

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(180) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'ADMIN',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id BIGSERIAL PRIMARY KEY,
      barcode VARCHAR(120) UNIQUE NOT NULL,
      name VARCHAR(180) NOT NULL,
      category VARCHAR(100),
      size VARCHAR(40),
      color VARCHAR(80),
      cost_price NUMERIC(12,2) NOT NULL DEFAULT 0,
      sale_price NUMERIC(12,2) NOT NULL DEFAULT 0,
      quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
      minimum_stock INTEGER NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
      notes TEXT,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS movements (
      id BIGSERIAL PRIMARY KEY,
      product_id BIGINT NOT NULL REFERENCES products(id),
      user_id BIGINT REFERENCES users(id),
      type VARCHAR(20) NOT NULL CHECK (type IN ('ENTRADA', 'SAIDA', 'AJUSTE')),
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      previous_quantity INTEGER NOT NULL,
      new_quantity INTEGER NOT NULL,
      note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_movements_created_at ON movements(created_at DESC)`;

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await sql`
    INSERT INTO users (name, email, password_hash)
    VALUES (${adminName}, ${adminEmail}, ${passwordHash})
    ON CONFLICT (email)
    DO UPDATE SET
      name = EXCLUDED.name,
      password_hash = EXCLUDED.password_hash,
      active = TRUE
  `;

  return NextResponse.json({
    success: true,
    message: "Banco instalado e usuário administrador configurado."
  });
}
