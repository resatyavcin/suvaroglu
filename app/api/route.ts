export async function GET() {
  try {
    return Response.json({ status: 200, data: 'Hello' });
  } catch (err) {
    Response.json({ error: err });
  }
}
