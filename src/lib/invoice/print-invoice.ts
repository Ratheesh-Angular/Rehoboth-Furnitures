/**
 * Opens a print popup with the given invoice DOM node (same path used by /billing).
 * Returns false if the popup was blocked.
 */
export function printInvoiceNode(invoiceNode: HTMLElement): boolean {
  const printWindow = window.open("", "_blank", "width=900,height=1200");
  if (!printWindow) {
    return false;
  }

  const styles = Array.from(
    document.querySelectorAll<HTMLStyleElement | HTMLLinkElement>(
      'style, link[rel="stylesheet"]',
    ),
  )
    .map((el) => el.outerHTML)
    .join("\n");

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Invoice Print</title>
        ${styles}
        <style>
          @page { size: A4; margin: 0; }
          html, body { margin: 0; padding: 0; background: #fff; }
          body, body * { color: #000 !important; }
          #invoice-print {
            box-sizing: border-box !important;
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 10mm 8mm !important;
          }
          #invoice-print table thead {
            display: table-header-group;
          }
          #invoice-print table tr {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        ${invoiceNode.outerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
  return true;
}
