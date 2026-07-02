import { Router } from "express";
import PDFDocument from "pdfkit";

export function createReportRouter(reportService) {
  const router = Router();

  router.get("/summary", async (req, res, next) => {
    try {
      const report = await reportService.summary(req.query.startDate, req.query.endDate);
      res.json({ report });
    } catch (error) {
      next(error);
    }
  });

  router.get("/pdf", async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.summary(startDate, endDate);

      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=laporan-penjualan.pdf");

      doc.pipe(res);

      doc.fontSize(20).text("Laporan Penjualan Toko Sulasih");
      doc.moveDown();

      doc.text(`Periode: ${startDate} s/d ${endDate}`);
      doc.moveDown();

      doc.text(`Total Transaksi: ${report.transactionCount}`);
      doc.text(`Total Pendapatan: Rp ${report.revenue.toLocaleString("id-ID")}`);
      doc.moveDown();

      doc.text("Produk Terlaris");
      report.bestSellers.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.name} (${item.sold_quantity} pcs)`);
      });

      doc.end();
    } catch (error) {
      next(error);
    }
  });

  return router;
}