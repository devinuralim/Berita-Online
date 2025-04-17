const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors()); // Biar bisa diakses dari React Native
app.use(express.json());

app.get("/scrape", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "URL tidak diberikan" });

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Ambil teks dari tag artikel (bisa diubah sesuai kebutuhan)
    const content = await page.evaluate(() => {
      return (
        document.querySelector("article")?.innerText ||
        "Konten tidak ditemukan."
      );
    });

    await browser.close();
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));
