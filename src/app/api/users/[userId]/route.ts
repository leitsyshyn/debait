import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export async function GET(
  _req: Request,
  props: { params: Promise<{ userId: string }> }
) {
  const params = await props.params;
  const { userId } = params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: getUserDataSelect(session.user.id),
    });

    if (!user) {
      return new Response("Not found", { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
