import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const data = await request.formData();
  const email = String(data.get("email") ?? "").trim().toLowerCase();
  const password = String(data.get("password") ?? "");

  try {
    const users = await sql`
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = ${email} AND active = true
      LIMIT 1
    `;

    const user = users[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.redirect(
        new URL("/login?erro=E-mail ou senha inválidos.", request.url),
        303
      );
    }

    await createSession({
      userId: Number(user.id),
      name: String(user.name),
      email: String(user.email)
    });

    return NextResponse.redirect(new URL("/", request.url), 303);
  } catch {
    return NextResponse.redirect(
      new URL("/login?erro=Banco ainda não instalado ou indisponível.", request.url),
      303
    );
  }
}
