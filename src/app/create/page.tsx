"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { TextField } from "@/components/ui/text-field";

const steps = [
  "Define Agent",
  "Upload Soul",
  "Mint iNFT",
  "Register ENS",
  "Start Node",
  "Publish Listing",
];

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState(0);

  const canPrev = currentStep > 0;
  const canNext = currentStep < steps.length - 1;
  const progressText = useMemo(() => `${currentStep + 1} / ${steps.length}`, [currentStep]);

  return (
    <div className="space-y-5">
      <Panel className="space-y-3">
        <h1 className="text-2xl tracking-tight">Agent Packer</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Multi-step creator flow for packaging and publishing your agent.
        </p>
        <div className="grid gap-2 md:grid-cols-6">
          {steps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => setCurrentStep(index)}
              className={`border px-2 py-2 text-[10px] uppercase tracking-wide ${
                index === currentStep
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-muted)]"
              }`}
            >
              {index + 1}. {step}
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="space-y-4">
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
          Step {progressText}: {steps[currentStep]}
        </p>

        {currentStep === 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            <TextField label="Agent Name" value="trader-alpha" />
            <TextField label="Strategy" value="aggressive" />
            <TextField label="Sale Price (USDC)" value={560} />
            <TextField label="Rental Price (USDC/day)" value={35} />
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-[var(--color-muted)]">
              Upload JSON bundle to 0G Storage (UI only for now).
            </p>
            <div className="border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-sm">
              Upload progress: 74% (simulated)
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <p className="text-sm text-[var(--color-muted)]">
            Mint action will call registry contract with storage hash and listing prices.
          </p>
        )}

        {currentStep === 3 && (
          <p className="text-sm text-[var(--color-muted)]">
            ENS records to set: storage-hash, strategy, axl-peer-id, marketplace-contract.
          </p>
        )}

        {currentStep === 4 && (
          <pre className="overflow-x-auto border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-xs text-[var(--color-muted)]">
            npm install && node agent.js --name trader-alpha --inft-id 101
          </pre>
        )}

        {currentStep === 5 && (
          <div className="grid gap-2 text-sm text-[var(--color-muted)]">
            <p>ENS: trader-alpha.eth</p>
            <p>Token ID: #101</p>
            <p>Storage hash: 0g://8f1a2c9d1-trader-alpha</p>
            <p>Ready to publish listing.</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={canPrev ? () => setCurrentStep((prev) => prev - 1) : undefined}
            className={!canPrev ? "pointer-events-none opacity-50" : ""}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            onClick={canNext ? () => setCurrentStep((prev) => prev + 1) : undefined}
            className={!canNext ? "pointer-events-none opacity-50" : ""}
          >
            {canNext ? "Next Step" : "Publish Listing"}
          </Button>
        </div>
      </Panel>
    </div>
  );
}
