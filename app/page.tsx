"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [text, setText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  // const [imageFile, setImageFile] = useState<File | null>(null);

  const generateFiles = async () => {
    // Generate PDF with better formatting
    const pdf = new jsPDF();
    pdf.setFontSize(12);
    const splitText = pdf.splitTextToSize(text, 180);
    pdf.text(splitText, 15, 20);
    const pdfBlob = pdf.output("blob");
    const pdfFile = new File([pdfBlob], "generated.pdf", {
      type: "application/pdf",
    });
    setPdfFile(pdfFile);

    // Generate Image with better formatting
    // const canvas = document.createElement("canvas");
    // canvas.width = 600;
    // canvas.height = 400;
    // const ctx = canvas.getContext("2d");
    // if (ctx) {
    //   ctx.fillStyle = "white";
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);
    //   ctx.fillStyle = "black";
    //   ctx.font = "16px Arial";
    //   const lines = text.split("\n");
    //   lines.forEach((line, index) => {
    //     ctx.fillText(line, 20, 30 + index * 20);
    //   });
    // }
    // const imageBlob = await new Promise<Blob>((resolve) =>
    //   canvas.toBlob((blob) => resolve(blob as Blob))
    // );
    // const imageFile = new File([imageBlob], "generated.png", {
    //   type: "image/png",
    // });
    // setImageFile(imageFile);
  };

  const shareOnWhatsApp = async () => {
    if (pdfFile) {
      const files = [pdfFile];
      if (navigator.share && navigator.canShare({ files })) {
        try {
          await navigator.share({
            files: files,
            title: "Generated Files",
            text: "Here are the generated PDF and image files.",
          });
          console.log("Files shared successfully");
        } catch (error) {
          console.error("Error sharing files:", error);
          manualShareInstructions();
        }
      } else {
        manualShareInstructions();
      }
    } else {
      alert("Please generate files before sharing.");
    }
  };

  const manualShareInstructions = () => {
    alert(
      "To share these files on WhatsApp:\n" +
        "1. Download both the PDF and PNG files.\n" +
        "2. Open WhatsApp on your device.\n" +
        "3. Choose the contact or group you want to send the files to.\n" +
        "4. Tap the attachment icon and select the downloaded files.\n" +
        "5. Send the message with the attached files."
    );
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">PDF and Image Generator</h1>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-4"
        placeholder="Enter text to generate files"
        rows={5}
      />
      <Button onClick={generateFiles} variant="default" className="mb-4 w-full">
        Generate Files
      </Button>

      <Button
        onClick={shareOnWhatsApp}
        variant="secondary"
        className="mb-4 w-full"
        disabled={!pdfFile}
      >
        Share on WhatsApp
      </Button>

      {pdfFile && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Generated PDF:</h2>
          <Button
            onClick={() => saveAs(pdfFile, "generated.pdf")}
            variant="outline"
            className="mt-2 w-full"
          >
            Download PDF
          </Button>
        </div>
      )}
    </main>
  );
}
