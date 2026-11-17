"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Bookmark,
  FlaskConical,
  Info,
  Loader2,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  ArrowLeftRight,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PredictionCard } from "@/components/analytics/prediction-card";
import { TeamMonogram } from "@/components/ui/team-monogram";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { matchLabPage } from "@/content/product";
import { requestJson } from "@/lib/client-api";
import { cn } from "@/lib/utils";
import type { ModelLeagueOption, PredictionResult } from "@/types";

const saveFormSchema = z.object({
  title: z.string().trim().max(90, "Keep the title under 90 characters.").optional(),
  notes: z.string().trim().max(500, "Keep your notes under 500 characters.").optional(),
});

type SaveValues = z.input<typeof saveFormSchema>;

type SaveResponse = {
  ok: true;
  analysis: { id: string; title: string };
};

export function MatchLabForm({
  leagues,
  signedIn,
  loginHref,
  initialPrediction,
  initialCompetitionId,
  initialHomeId,
  initialAwayId,
}: {
  leagues: ModelLeagueOption[];
  signedIn: boolean;
  loginHref: string;
  initialPrediction: PredictionResult | null;
  initialCompetitionId: string;
  initialHomeId: string;
  initialAwayId: string;
}) {
  const router = useRouter();
  const fallbackLeague = leagues[0];
  const startingLeague =
    leagues.find((league) => league.id === initialCompetitionId) ?? fallbackLeague;

  const [competitionId, setCompetitionId] = useState(startingLeague?.id ?? "");
  const [homeId, setHomeId] = useState(
    startingLeague?.teams.some((team) => team.id === initialHomeId) ? initialHomeId : "",
  );
  const [awayId, setAwayId] = useState(
    startingLeague?.teams.some((team) => team.id === initialAwayId) ? initialAwayId : "",
  );
  const [result, setResult] = useState<PredictionResult | null>(initialPrediction);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const league = leagues.find((entry) => entry.id === competitionId) ?? fallbackLeague;
  const teams = league?.teams ?? [];
  const homeTeam = teams.find((team) => team.id === homeId);
  const awayTeam = teams.find((team) => team.id === awayId);

  const {
    register,
    handleSubmit,
    reset: resetSaveForm,
    setValue,
    formState: { errors: saveErrors, isSubmitting: saving },
  } = useForm<SaveValues>({
    resolver: zodResolver(saveFormSchema),
    defaultValues: { title: "", notes: "" },
  });

  async function runModel(nextHome: string, nextAway: string) {
    if (!competitionId || !nextHome || !nextAway) {
      setRunError("Choose a competition, a home team, and an away team.");
      return;
    }

    if (nextHome === nextAway) {
      setRunError("Choose two different teams.");
      return;
    }

    setRunning(true);
    setRunError(null);
    setSavedId(null);

    const response = await requestJson<PredictionResult>("/api/model/predict", {
      method: "POST",
      body: { competitionId, homeTeamId: nextHome, awayTeamId: nextAway },
    });

    setRunning(false);

    if (!response.ok) {
      setRunError(response.message || matchLabPage.result.error);
      setResult(null);
      return;
    }

    setResult(response.data);
    setValue("title", `${response.data.home.shortName} vs ${response.data.away.shortName}`);
    setSavedId(null);
  }

  function onCompetitionChange(value: string) {
    setCompetitionId(value);
    setHomeId("");
    setAwayId("");
    setResult(null);
    setRunError(null);
    setSavedId(null);
  }

  function swapSides() {
    if (!homeId || !awayId) return;
    const nextHome = awayId;
    const nextAway = homeId;
    setHomeId(nextHome);
    setAwayId(nextAway);
    void runModel(nextHome, nextAway);
  }

  function clearFixture() {
    setHomeId("");
    setAwayId("");
    setResult(null);
    setRunError(null);
    setSavedId(null);
    resetSaveForm();
  }

  const onSave = handleSubmit(async (values) => {
    if (!result) return;

    const response = await requestJson<SaveResponse>("/api/analyses", {
      method: "POST",
      body: {
        competitionId: result.competition.id,
        homeTeamId: result.home.id,
        awayTeamId: result.away.id,
        title: values.title?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
      },
    });

    if (!response.ok) {
      setRunError(response.message);
      return;
    }

    setSavedId(response.data.analysis.id);
    resetSaveForm();
    router.refresh();
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
      <div className="space-y-4 lg:sticky lg:top-24">
        <div className="card-vv p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow text-muted">{matchLabPage.form.title}</p>
              <h2 className="mt-1.5 font-display text-[20px] font-bold tracking-tight text-ink">
                {matchLabPage.form.title}
              </h2>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand dark:bg-lime/10 dark:text-lime">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">{matchLabPage.form.copy}</p>

          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void runModel(homeId, awayId);
            }}
          >
            <Field label={matchLabPage.form.competition} htmlFor="competition">
              <Select
                id="competition"
                value={competitionId}
                onChange={(event) => onCompetitionChange(event.target.value)}
              >
                {leagues.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name} · {entry.season}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <Field label={matchLabPage.form.home} htmlFor="home-team">
                <Select
                  id="home-team"
                  value={homeId}
                  onChange={(event) => {
                    setHomeId(event.target.value);
                    setResult(null);
                    setSavedId(null);
                    setRunError(null);
                  }}
                  disabled={!league}
                >
                  <option value="">
                    {league ? matchLabPage.form.selectTeam : matchLabPage.form.placeholder}
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} · {team.points} pts
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="hidden pb-1 sm:block">
                <button
                  type="button"
                  onClick={swapSides}
                  disabled={!homeId || !awayId || running}
                  aria-label={matchLabPage.form.swap}
                  title={matchLabPage.form.swap}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-card text-muted transition-colors hover:border-brand hover:text-ink disabled:opacity-40"
                >
                  <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <Field label={matchLabPage.form.away} htmlFor="away-team">
                <Select
                  id="away-team"
                  value={awayId}
                  onChange={(event) => {
                    setAwayId(event.target.value);
                    setResult(null);
                    setSavedId(null);
                    setRunError(null);
                  }}
                  disabled={!league}
                >
                  <option value="">
                    {league ? matchLabPage.form.selectTeam : matchLabPage.form.placeholder}
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} · {team.points} pts
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={swapSides}
                disabled={!homeId || !awayId || running}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-[12px] font-semibold text-muted hover:border-brand hover:text-ink disabled:opacity-40 sm:hidden"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
                Swap
              </button>
              <Button type="submit" loading={running} disabled={running || !homeId || !awayId}>
                {running ? matchLabPage.form.running : matchLabPage.form.submit}
                {!running ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFixture}
                disabled={running}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {matchLabPage.form.reset}
              </Button>
            </div>

            {runError ? <Alert tone="error">{runError}</Alert> : null}
          </form>

          {homeTeam && awayTeam ? (
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl border border-line bg-paper-2/50 p-3">
              <TeamChip team={homeTeam} align="left" />
              <span className="mono text-[10px] uppercase tracking-[0.14em] text-muted">vs</span>
              <TeamChip team={awayTeam} align="right" />
            </div>
          ) : null}
        </div>

        <div className="card-vv p-5">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-gold" aria-hidden="true" />
            <h3 className="font-display text-[14px] font-bold text-ink">{matchLabPage.limits.title}</h3>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">{matchLabPage.limits.copy}</p>
        </div>
      </div>

      <div id="match-lab-output" className="space-y-4">
        {result ? (
          <>
            <PredictionCard data={result} />

            {signedIn ? (
              <div className="card-vv p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow text-muted">{matchLabPage.save.title}</p>
                    <h2 className="mt-1.5 font-display text-[18px] font-bold tracking-tight text-ink">
                      Keep this one.
                    </h2>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                      {matchLabPage.save.copy}
                    </p>
                  </div>
                  <Save className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                </div>

                {savedId ? (
                  <Alert tone="success" title={matchLabPage.result.savedTitle} className="mt-4">
                    <p>{matchLabPage.result.savedCopy}</p>
                    <Link
                      href={`/dashboard/analyses/${savedId}`}
                      className="mt-2 inline-flex items-center gap-1 font-semibold underline underline-offset-2"
                    >
                      {matchLabPage.save.openSaved}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Alert>
                ) : (
                  <form onSubmit={onSave} className="mt-4 space-y-3.5" noValidate>
                    <Field
                      label={matchLabPage.save.titleLabel}
                      htmlFor="analysis-title"
                      error={saveErrors.title?.message}
                    >
                      <Input
                        id="analysis-title"
                        placeholder={matchLabPage.save.titlePlaceholder}
                        aria-invalid={saveErrors.title ? true : undefined}
                        {...register("title")}
                      />
                    </Field>
                    <Field
                      label={matchLabPage.save.notesLabel}
                      htmlFor="analysis-notes"
                      error={saveErrors.notes?.message}
                    >
                      <Textarea
                        id="analysis-notes"
                        placeholder={matchLabPage.save.notesPlaceholder}
                        aria-invalid={saveErrors.notes ? true : undefined}
                        {...register("notes")}
                      />
                    </Field>
                    <Button type="submit" loading={saving} disabled={saving} size="sm">
                      <Bookmark className="h-4 w-4" aria-hidden="true" />
                      {saving ? matchLabPage.save.saving : matchLabPage.save.submit}
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <div className="card-vv p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand dark:bg-lime/10 dark:text-lime">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-display text-[17px] font-bold text-ink">
                      {matchLabPage.save.signInTitle}
                    </h2>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                      {matchLabPage.save.signInCopy}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <ButtonLink href={loginHref} size="sm">
                        {matchLabPage.save.signIn}
                      </ButtonLink>
                      <ButtonLink href="/signup" variant="outline" size="sm">
                        {matchLabPage.save.create}
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card-vv flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-soft text-brand dark:bg-lime/10 dark:text-lime">
              <FlaskConical className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-[22px] font-bold tracking-tight text-ink">
              {running ? matchLabPage.form.running : matchLabPage.result.emptyTitle}
            </h2>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
              {matchLabPage.result.emptyCopy}
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-full border border-line bg-paper-2/60 px-3 py-1.5 text-[10.5px] text-muted">
              {running ? (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              ) : (
                <ShieldCheck className="h-3 w-3 text-brand dark:text-lime" aria-hidden="true" />
              )}
              {running ? "Fitting the distribution" : "Independent Poisson · v1.0"}
            </div>
          </div>
        )}

        <div className="card-vv p-5 sm:p-6">
          <p className="eyebrow text-muted">{matchLabPage.how.eyebrow}</p>
          <h2 className="mt-1.5 font-display text-[18px] font-bold tracking-tight text-ink">
            {matchLabPage.how.title}
          </h2>
          <ul className="mt-4 space-y-3">
            {matchLabPage.how.items.map((item) => (
              <li key={item} className="flex gap-2.5 text-[12.5px] leading-relaxed text-muted">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand dark:bg-lime" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/methodology"
            className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline dark:text-lime"
          >
            Read the full methodology
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function TeamChip({
  team,
  align,
}: {
  team: ModelLeagueOption["teams"][number];
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <TeamMonogram name={team.name} monogram={team.monogram} color={team.color} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-[12px] font-semibold text-ink">{team.shortName}</p>
        <p className="mono text-[9.5px] text-muted">
          {team.played} played · {team.points} pts
        </p>
      </div>
    </div>
  );
}
