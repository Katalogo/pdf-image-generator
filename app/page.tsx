"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [text, setText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  //   const [imageFile, setImageFile] = useState<File | null>(null);

  const generateFiles = async () => {
    const ingredients = text.split("\n").map((line) => {
      const [name, quantity] = line.split(":");
      return { name: name.trim(), quantity: quantity.trim() };
    });

    // Generate PDF
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    let yPos = 20;
    const leftColumn = 20;
    const rightColumn = 115;

    ingredients.forEach((ingredient, index) => {
      //   if (index % 2 === 0 && index !== 0) {
      //     yPos += 0; // Add space between rows
      //   }
      const column = index % 2 === 0 ? leftColumn : rightColumn;
      pdf.text(`${ingredient.name}`, column, yPos);
      pdf.text(`${ingredient.quantity}`, column + 78, yPos, { align: "right" });
      if (index % 2 !== 0) {
        yPos += 8; // Move to next line after right column
      }
    });

    const pdfBlob = pdf.output("blob");
    const pdfFile = new File([pdfBlob], "ingredients.pdf", {
      type: "application/pdf",
    });
    setPdfFile(pdfFile);

    // Generate Image
    // const canvas = document.createElement("canvas");
    // canvas.width = 800;
    // canvas.height = Math.max(600, ingredients.length * 17 + 40);
    // const ctx = canvas.getContext("2d");
    // if (ctx) {
    //   ctx.fillStyle = "white";
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);
    //   ctx.fillStyle = "black";
    //   ctx.font = "18px Arial";

    //   let yPos = 100;
    //   const leftColumn = 100;
    //   const rightColumn = 440;

    //   ingredients.forEach((ingredient, index) => {
    //     // if (index % 2 === 0 && index !== 0) {
    //     //   yPos += 20; // Add space between rows
    //     // }
    //     const column = index % 2 === 0 ? leftColumn : rightColumn;
    //     ctx.textAlign = "left";
    //     ctx.fillText(ingredient.name, column, yPos);
    //     ctx.textAlign = "right";
    //     ctx.fillText(ingredient.quantity, column + 270, yPos);
    //     if (index % 2 !== 0) {
    //       yPos += 30; // Move to next line after right column
    //     }
    //   });
    // }

    // const imageBlob = await new Promise<Blob>((resolve) =>
    //   canvas.toBlob((blob) => resolve(blob as Blob))
    // );
    // const imageFile = new File([imageBlob], "ingredients.png", {
    //   type: "image/png",
    // });
    // setImageFile(imageFile);
  };

  const shareOnWhatsApp = async () => {
    // if (pdfFile && imageFile) {
    //   const files = [pdfFile, imageFile];
    if (pdfFile) {
      const files = [pdfFile];
      if (!navigator.share && navigator.canShare({ files })) {
        try {
          await navigator.share({
            files: files,
            title: "Ingredients List",
            text: "Here are the ingredients list as PDF and image files.",
          });
          console.log("Files shared successfully");
        } catch (error) {
          console.error("Error sharing files:", error);
          //   manualShareInstructions();
          shareToSpecificNumber();
        }
      } else {
        // manualShareInstructions();
        shareToSpecificNumber();
      }
    } else {
      alert("Please generate files before sharing.");
    }
  };

  //   const manualShareInstructions = () => {
  const shareToSpecificNumber = () => {
    if (!phoneNumber) {
      alert("Please enter a valid Indian WhatsApp number.");
      return;
    }

    // Remove any non-digit characters from the phone number
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    console.log(cleanNumber);

    // Check if the number starts with '91' (India country code)
    const formattedNumber = cleanNumber.startsWith("91")
      ? cleanNumber
      : `91${cleanNumber}`;

    // Create a WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedNumber}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
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
      <h1 className="text-2xl font-bold mb-4">Ingredients List Generator</h1>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-4"
        placeholder="Enter ingredients (one per line) in format: Ingredient: Quantity"
        rows={10}
      />
      <Button onClick={generateFiles} variant="default" className="mb-4 w-full">
        Generate Files
      </Button>
      <Input
        type="tel"
        placeholder="Enter Indian WhatsApp number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="mb-4"
      />
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
            onClick={() => saveAs(pdfFile, "ingredients.pdf")}
            variant="outline"
            className="mt-2 w-full"
          >
            Download PDF
          </Button>
        </div>
      )}
      {/* {imageFile && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Generated Image:</h2>
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Generated"
            className="max-w-full h-auto mt-2 border border-black"
          />
          <Button
            onClick={() => saveAs(imageFile, "ingredients.png")}
            variant="outline"
            className="mt-2 w-full"
          >
            Download Image
          </Button>
        </div>
      )} */}
    </main>
  );
}
