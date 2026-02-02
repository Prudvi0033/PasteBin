export function getNow(req: Request) {
  if (process.env.TEST_MODE === "1") {
    const header = req.headers.get("x-test-now-ms")
    if (header) return new Date(Number(header))
  }
  return new Date()
}
