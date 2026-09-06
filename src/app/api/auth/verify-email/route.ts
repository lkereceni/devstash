import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in?error=invalid-token", request.url));
  }

  const verificationToken = await prisma.verificationToken.findFirst({
    where: { token },
  });

  if (!verificationToken) {
    return NextResponse.redirect(new URL("/sign-in?error=invalid-token", request.url));
  }

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      },
    },
  });

  if (verificationToken.expires < new Date()) {
    return NextResponse.redirect(new URL("/sign-in?error=expired-token", request.url));
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });

  return NextResponse.redirect(new URL("/sign-in?verified=1", request.url));
}
