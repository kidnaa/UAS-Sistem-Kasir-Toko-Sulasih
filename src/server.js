import dotenv from "dotenv";
import { createApp } from "./presentation/app.js";

dotenv.config();

const port = Number(process.env.APP_PORT || 3000);

const app = createApp();

app.listen(port, () => {
  console.log(
    `Sistem Kasir Toko Sulasih berjalan di http://localhost:${port}`
  );
});