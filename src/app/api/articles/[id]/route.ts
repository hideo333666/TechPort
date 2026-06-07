import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const patchSchema = z
  .object({
    isRead: z.boolean().optional(),
    isSaved: z.boolean().optional(),
  })
  .refine((v) => v.isRead !== undefined || v.isSaved !== undefined, {
    message: "isRead か isSaved のいずれかを指定してください",
  });

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "id が不正です" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON ボディが必要です" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join(", ") },
      { status: 400 },
    );
  }

  try {
    const article = await prisma.article.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ article });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });
    }
    throw err;
  }
}
