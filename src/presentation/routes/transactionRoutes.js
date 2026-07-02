import { Router } from "express";

export function createTransactionRouter(transactionService) {
  const router = Router();

  // GET ALL
  router.get("/", async (_req, res, next) => {
    try {
      const transactions = await transactionService.listRecent();
      res.json({ transactions });
    } catch (error) {
      next(error);
    }
  });

  // CHECKOUT
  router.post("/", async (req, res, next) => {
    try {
      const transaction = await transactionService.checkout(req.body);
      res.status(201).json({ transaction });
    } catch (error) {
      next(error);
    }
  });

  // 🧾 RECEIPT (YANG KAMU TAMBAH)
  router.get("/receipt/:id", async (req, res, next) => {
    try {
      const trx = await transactionService.getById(req.params.id);

      if (!trx) {
        return res.status(404).json({ message: "Transaksi tidak ditemukan" });
      }

      res.send(`
        <html>
          <head>
            <title>Struk</title>
            <style>
              body {
                font-family: monospace;
                width: 280px;
                margin: 0 auto;
                padding: 10px;
              }
              .center { text-align: center; }
              hr { border: 1px dashed #000; }
            </style>
          </head>
          <body>

            <div class="center">
              <h3>TOKO SULASIH</h3>
              <p>STRUK PEMBELIAN</p>
              <hr/>
            </div>

            <p>Invoice: ${trx.invoice_number}</p>
            <p>Kasir: ${trx.cashier_name}</p>
            <p>Tanggal: ${new Date(trx.created_at).toLocaleString("id-ID")}</p>

            <hr/>

            ${trx.items.map(item => `
              <div>
                ${item.name}<br/>
                ${item.quantity} x ${Number(item.price).toLocaleString("id-ID")}
              </div>
            `).join("")}

            <hr/>

            <h3>Total: Rp ${Number(trx.total).toLocaleString("id-ID")}</h3>

            <script>
              window.print();
            </script>

          </body>
        </html>
      `);

    } catch (error) {
      next(error);
    }
  });

  return router;
}