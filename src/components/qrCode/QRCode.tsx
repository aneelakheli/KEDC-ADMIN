import Image from "next/image";
import { useRef } from "react";
import QRCode from "react-qr-code";

export const QRCodeGenerator = ({ id }: { id: String }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownloadQR = () => {
    // const svg = qrRef.current;
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    // Convert SVG to Data URL
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.svg"; // Download as SVG
    link.click();
    URL.revokeObjectURL(url);

    if (!svg) return;

    // const serializer = new XMLSerializer();
    // const svgString = serializer.serializeToString(svg);
    // const canvas = document.createElement("canvas");
    // const ctx = canvas.getContext("2d");
    // const img = new Image();

    // img.onload = () => {
    //   canvas.width = img.width;
    //   canvas.height = img.height;
    //   ctx.drawImage(img, 0, 0);

    //   // Convert to selected format (PNG or JPG)
    //   const imageFormat = format === "jpg" ? "image/jpeg" : "image/png";
    //   const imgURL = canvas.toDataURL(imageFormat);

    //   // Create a download link
    //   const link = document.createElement("a");
    //   link.href = imgURL;
    //   link.download = `qrcode.${format}`;
    //   link.click();
    // };

    // img.src = "data:image/svg+xml;base64," + btoa(svgString);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div ref={qrRef} className="my-4">
          <QRCode
            size={200}
            value={`https://www.kedc.edu.np/catalogues/${id}`}
          />
        </div>
      </div>
      <div
        onClick={handleDownloadQR}
        className="mx-4 my-6 cursor-pointer rounded-lg bg-blue-900 px-6 py-3 text-lg text-white hover:bg-blue-500"
      >
        Download QR Code
      </div>
    </div>
  );
};
