"use client";

import { useState } from "react";
import {
  X,
  FileText,
  Link2,
  Lock,
  Check,
  Download,
  ExternalLink,
  Copy,
  Loader2,
  Eye,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useSubscription } from "@/lib/context";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick: () => void;
}

export function ShareModal({
  isOpen,
  onClose,
  onUpgradeClick,
}: ShareModalProps) {
  const t = useTranslations("app.modals.share");
  const { checkFeatureAccess, isPaid } = useSubscription();

  const [linkCopied, setLinkCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [linkGenerating, setLinkGenerating] = useState(false);
  const [linkReady, setLinkReady] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const pdfAccess = checkFeatureAccess("pdf");
  const shareAccess = checkFeatureAccess("share");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      generatedLink || "https://smetamaker.app/e/abc123",
    );
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleGenerateLink = () => {
    if (!shareAccess.allowed) {
      onUpgradeClick();
      return;
    }
    setLinkGenerating(true);
    // Mock link generation
    setTimeout(() => {
      setLinkGenerating(false);
      setLinkReady(true);
      setGeneratedLink(
        "https://smetamaker.app/e/prj-" +
          Math.random().toString(36).substring(7),
      );
    }, 1500);
  };

  const handleExportPDF = () => {
    if (!pdfAccess.allowed) {
      onUpgradeClick();
      return;
    }
    setPdfGenerating(true);
    // Mock PDF generation
    setTimeout(() => {
      setPdfGenerating(false);
      setPdfReady(true);
    }, 2000);
  };

  const handleDownloadPDF = () => {
    // Mock download - in real app would trigger actual download
    console.log("[v0] Downloading PDF...");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">{t("shareTitle")}</h2>
            <p className="text-sm text-gray-500">{t("shareSubtitle")}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* PDF Export Option */}
          <div
            className={`relative p-4 rounded-xl border-2 transition-all ${
              pdfAccess.allowed
                ? "border-gray-200 bg-white"
                : "border-gray-100 bg-gray-50/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  pdfAccess.allowed
                    ? "bg-linear-to-br from-red-500 to-red-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {pdfAccess.allowed ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${pdfAccess.allowed ? "text-gray-900" : "text-gray-500"}`}
                  >
                    {t("exportPDF")}
                  </span>
                  {!pdfAccess.allowed && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {pdfAccess.allowed
                    ? isPaid
                      ? t("pdfWithoutWatermark")
                      : t("pdfWithWatermark")
                    : t("pdfExplanation")}
                </p>
              </div>
            </div>

            {pdfAccess.allowed ? (
              <div className="mt-4">
                {!pdfReady ? (
                  <Button
                    onClick={handleExportPDF}
                    disabled={pdfGenerating}
                    className="w-full bg-gray-900 hover:bg-gray-800 transition-colors"
                  >
                    {pdfGenerating ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("exportPDFGenerating")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        {t("downloadNow")}
                      </span>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      {t("exportPDFReady")}
                    </span>
                  </Button>
                )}
              </div>
            ) : (
              <Button
                onClick={onUpgradeClick}
                className="mt-4 w-full bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                {t("upgradeToStarter")}
              </Button>
            )}
          </div>

          {/* Share Link Option */}
          <div
            className={`relative p-4 rounded-xl border-2 transition-all ${
              shareAccess.allowed
                ? "border-gray-200 bg-white"
                : "border-gray-100 bg-gray-50/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  shareAccess.allowed
                    ? "bg-linear-to-br from-blue-500 to-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {shareAccess.allowed ? (
                  <Link2 className="w-5 h-5" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${shareAccess.allowed ? "text-gray-900" : "text-gray-500"}`}
                  >
                    {t("shareLink")}
                  </span>
                  {!shareAccess.allowed && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {shareAccess.allowed ? t("shareLinkDesc") : t("shareExplanation")}
                </p>
              </div>
            </div>

            {shareAccess.allowed ? (
              <div className="mt-4">
                {!linkReady ? (
                  <Button
                    onClick={handleGenerateLink}
                    disabled={linkGenerating}
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
                  >
                    {linkGenerating ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("shareLinkGenerating")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Link2 className="w-4 h-4" />
                        {t("createLink")}
                      </span>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 px-3 rounded-lg bg-gray-100 border border-gray-200 flex items-center overflow-hidden">
                        <span className="text-sm text-gray-600 truncate font-mono">
                          {generatedLink.replace("https://", "")}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleCopyLink}
                        variant="outline"
                        className="h-10 px-3 border-gray-300 bg-transparent"
                      >
                        {linkCopied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-10 px-3 border-gray-300 bg-transparent"
                        onClick={() => window.open(generatedLink, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Eye className="w-3.5 h-3.5" />
                      {t("viewOnlyNote")} · {t("linkExpires")}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={onUpgradeClick}
                className="mt-4 w-full bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                {t("upgradeToStarter")}
              </Button>
            )}
          </div>
        </div>

        {/* Watermark note for free users */}
        {!isPaid && (
          <div className="px-5 pb-5">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/50">
              <p className="text-xs text-amber-700 flex items-center gap-2">
                <FileText className="w-4 h-4 shrink-0" />
                {t("watermarkNote")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
