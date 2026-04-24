export default async function handler(req, res) {
  if (req.method === "POST") {
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });

      if (response.ok) {
        return res.status(200).json({ message: "Enviado com sucesso!" });
      }
      throw new Error("Erro no Webhook");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(405).json({ message: "Método não permitido" });
}
