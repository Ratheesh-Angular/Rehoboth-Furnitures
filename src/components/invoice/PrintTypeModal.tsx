"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PrintType = "original" | "duplicate";

type PrintTypeModalProps = {
  open: boolean;
  printType: PrintType;
  onPrintTypeChange: (type: PrintType) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function PrintTypeModal({
  open,
  printType,
  onPrintTypeChange,
  onClose,
  onConfirm,
}: PrintTypeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-black/60 hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4 text-black">
          Choose Print Type
        </h2>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => onPrintTypeChange("original")}
            className={`rounded px-3 py-2 text-sm font-medium border cursor-pointer ${
              printType === "original"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black/40 hover:bg-neutral-100"
            }`}
          >
            Original Bill
          </button>
          <button
            type="button"
            onClick={() => onPrintTypeChange("duplicate")}
            className={`rounded px-3 py-2 text-sm font-medium border cursor-pointer ${
              printType === "duplicate"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black/40 hover:bg-neutral-100"
            }`}
          >
            Duplicate Bill
          </button>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onConfirm}
            className="bg-black hover:bg-neutral-900 cursor-pointer"
          >
            <Printer className="h-4 w-4 mr-2" />
            <span className="whitespace-nowrap">Print</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
