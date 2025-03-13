export const revalidate = 60;

export async function GET() {
  const data = {
    position: "Web Development",
    name: "David",
  };

  const posts = data;

  return Response.json(posts);
}
