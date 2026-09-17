import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const outDir = "/home/ubuntu/projects/text-adventure-4676277d/qa-screenshots";
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "Abenteuer starten" }).click();
await page.getByRole("button", { name: "Nach Lindendorf" }).click();
await page.getByRole("heading", { name: "Der Weg nach Lindendorf" }).waitFor();
await page.screenshot({ path: `${outDir}/mobile-prolog.png`, fullPage: true });
const prologue = await page.evaluate(() => ({
  viewportHeight: window.innerHeight,
  documentHeight: document.documentElement.scrollHeight,
  canScroll: document.documentElement.scrollHeight > window.innerHeight,
  choiceVisible: Boolean([...document.querySelectorAll("button")].find((button) => button.textContent?.includes("Weiter"))),
  horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
}));
await page.getByRole("button", { name: /Weiter/ }).click();
await page.getByRole("heading", { name: "Der Fremde am Weg" }).waitFor();
await page.screenshot({ path: `${outDir}/mobile-stranger.png`, fullPage: true });
const stranger = await page.evaluate(() => ({
  viewportHeight: window.innerHeight,
  documentHeight: document.documentElement.scrollHeight,
  canScroll: document.documentElement.scrollHeight > window.innerHeight,
  choices: [...document.querySelectorAll("button")].filter((button) => /^[1-4]/.test(button.textContent?.trim() ?? "")).length,
  horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
}));
console.log(JSON.stringify({ prologue, stranger }));
if (!prologue.choiceVisible || prologue.horizontalOverflow || stranger.choices !== 4 || stranger.horizontalOverflow) process.exitCode = 1;
await browser.close();
