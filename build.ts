import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import mjml2html from "mjml";
import { data, type ContentBlock, type Section } from "./data";

const TEMPLATE_PATH = join(import.meta.dir, "template", "index.mjml");
const OUTPUT_DIR = join(import.meta.dir, "template", "dist");
const OUTPUT_PATH = join(OUTPUT_DIR, "index.html");

function generateTextBlock(block: Extract<ContentBlock, { type: "text" }>): string {
  return block.paragraphs
    .map(
      (p) =>
        `<mj-text color="#e2e8f0">\n          ${p}\n        </mj-text>`
    )
    .join("\n\n        ");
}

function generateCodeBlock(block: Extract<ContentBlock, { type: "code" }>): string {
  const linesHtml = block.lines.join("<br/>\n              ");
  return `<mj-text padding="0px">
          <div class="terminal" style="padding: 16px; overflow-x: auto;">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #4b5563; padding-bottom: 10px;">
              # --- ${block.language.toUpperCase()} ---
            </div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20px; color: #e2e8f0;">
              ${linesHtml}
            </div>
          </div>
        </mj-text>`;
}

function generateSection(section: Section): string {
  const heading = `<mj-text font-size="20px" font-weight="600" color="#f8fafc" padding-top="25px"${section.content[0]?.type === "code" ? ' padding-bottom="10px"' : ""}>
          ${section.heading}
        </mj-text>`;

  const contentBlocks = section.content
    .map((block) => {
      switch (block.type) {
        case "text":
          return generateTextBlock(block);
        case "code":
          return generateCodeBlock(block);
      }
    })
    .join("\n\n        ");

  return `${heading}\n\n        ${contentBlocks}`;
}

function generateAllSections(sections: Section[]): string {
  return sections.map(generateSection).join("\n\n        ");
}

function interpolate(template: string): string {
  const sectionsMjml = generateAllSections(data.sections);

  return template
    .replace("<!--SECTIONS-->", sectionsMjml)
    .replace(/\{\{preview\}\}/g, data.preview)
    .replace(/\{\{meta\}\}/g, data.meta)
    .replace(/\{\{title\}\}/g, data.title)
    .replace(/\{\{subtitle\}\}/g, data.subtitle)
    .replace(/\{\{cta_url\}\}/g, data.cta_url)
    .replace(/\{\{cta_label\}\}/g, data.cta_label)
    .replace(/\{\{footer\}\}/g, data.footer);
}

function injectVmlGradient(html: string): string {
  const vmlOpening = `  <!--[if gte mso 9]>
  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="mso-width-percent:1000;">
  <v:fill type="gradient" color="#3c6eb4" color2="#3c95b4" angle="-90" />
  <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
  <div><![endif]-->`;

  const vmlClosing = `  <!--[if gte mso 9]></div></v:textbox></v:rect><![endif]-->`;

  return html
    .replace(/<body([^>]*)>/, `<body$1>\n${vmlOpening}\n`)
    .replace("</body>", `${vmlClosing}\n</body>`);
}

function postProcess(html: string): string {
  const gradientUrl = data.gradient_image_url;

  // 1. Strip background-color from app-bg div (fixes Gmail Android gradient rewrites)
  // Matches: class="app-bg" ... style="... background-color: #3c6eb4; ..."
  html = html.replace(
    /(class="app-bg[^"]*"[^>]*style="[^"]*?)background-color:\s*#[0-9a-fA-F]+;\s*/g,
    "$1"
  );

  // 2. Add x_gradient class to app-bg div (enables Outlook.com targeting)
  html = html.replace(/class="app-bg"/, 'class="app-bg x_gradient"');

  // 3. Inject Outlook.com/Yahoo/AOL image targeting CSS before </style>
  const outlookCss = `
  [class~="x_gradient"] {
    background-image: url('${gradientUrl}') !important;
    background-size: 100% 100% !important;
    background-repeat: no-repeat !important;
  }`;

  html = html.replace("</style>", `${outlookCss}\n</style>`);

  return html;
}

function generateGradientPng(): Buffer {
  // 1x2 PNG: top pixel #3c6eb4, bottom pixel #3c95b4
  // Minimal PNG structure: signature + IHDR + IDAT + IEND
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width=1, height=2, bit depth=8, color type=2 (RGB)
  const ihdrData = Buffer.from([
    0, 0, 0, 13, // length
    73, 72, 68, 82, // "IHDR"
    0, 0, 0, 1, // width
    0, 0, 0, 2, // height
    8, // bit depth
    2, // color type (RGB)
    0, // compression
    0, // filter
    0, // interlace
  ]);
  const ihdrCrc = crc32(ihdrData.subarray(4, 29));
  const ihdr = Buffer.concat([
    ihdrData,
    Buffer.from([ihdrCrc >>> 24, ihdrCrc >>> 16, ihdrCrc >>> 8, ihdrCrc]),
  ]);

  // IDAT: filtered raw pixels (filter byte 0 + RGB for each row)
  const rawData = Buffer.from([
    0, 0x3c, 0x6e, 0xb4, // row 0: filter=0, #3c6eb4
    0, 0x3c, 0x95, 0xb4, // row 1: filter=0, #3c95b4
  ]);
  const deflated = deflate(rawData);

  const idatData = Buffer.alloc(4 + 4 + deflated.length);
  idatData.writeUInt32BE(deflated.length, 0);
  idatData.write("IDAT", 4);
  deflated.copy(idatData, 8);
  const idatCrc = crc32(idatData.subarray(4));
  const idat = Buffer.concat([
    idatData,
    Buffer.from([idatCrc >>> 24, idatCrc >>> 16, idatCrc >>> 8, idatCrc]),
  ]);

  // IEND
  const iendData = Buffer.from([0, 73, 69, 78, 68]); // length=0 + "IEND"
  const iendCrc = crc32(iendData.subarray(4));
  const iend = Buffer.concat([
    iendData,
    Buffer.from([iendCrc >>> 24, iendCrc >>> 16, iendCrc >>> 8, iendCrc]),
  ]);

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// CRC32 for PNG checksums
function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Deflate (store mode, no compression — 1x2 PNG is tiny)
function deflate(data: Buffer): Buffer {
  const header = Buffer.from([0x78, 0x01]); // CMF, FLG (deflate, no dict, level 0)
  const len = Buffer.alloc(4);
  len.writeUInt16LE(data.length, 0);
  len.writeUInt16LE(data.length ^ 0xffff, 2);
  const nlen = Buffer.alloc(4);
  nlen.writeUInt16LE(data.length ^ 0xffff, 0);
  nlen.writeUInt16LE(data.length, 2);
  return Buffer.concat([header, len, nlen, data]);
}

function build(): void {
  const template = readFileSync(TEMPLATE_PATH, "utf-8");
  const mjmlSource = interpolate(template);

  const { html, errors } = mjml2html(mjmlSource, {
    validationLevel: "soft",
  });

  if (errors.length > 0) {
    console.error("MJML compilation errors:");
    errors.forEach((err) => console.error(`  - ${err.formattedMessage ?? err.message}`));
    process.exit(1);
  }

  const finalHtml = postProcess(injectVmlGradient(html));

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_PATH, finalHtml, "utf-8");

  // Generate gradient.png
  const png = generateGradientPng();
  const pngPath = join(OUTPUT_DIR, "gradient.png");
  writeFileSync(pngPath, png);

  const sizeKb = (Buffer.byteLength(finalHtml) / 1024).toFixed(1);
  console.log(`Built template/dist/index.html (${sizeKb} KB)`);
  console.log(`Built template/dist/gradient.png (${png.length} bytes)`);
}

build();
