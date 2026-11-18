import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllSlides } from "../../services/apis/slideService";
import { getAllParties } from "../../services/apis/partyService";
import { getAllProv } from "../../services/apis/config/provService";
import { getAllCity } from "../../services/apis/config/cityService";
import { getAllArea } from "../../services/apis/config/areaService";
import { getAllSubArea } from "../../services/apis/config/subAreaService";
import { useCurrentUser } from "../../utils/utilAuth";
import StatusBadge from "../../components/common/StatusBadge";
import { SlidesIcon, PartyIcon, SetupIcon, ChevronRightIcon, AddIcon } from "../../components/icons";
import PageHeader from "../../components/common/PageHeader";

// Every list endpoint returns totalRecords, so a 1-row page is enough for a count.
const countOf = async (request) => (await request)?.totalRecords ?? 0;

const fetchDashboard = async () => {
  const [slides, digital, latest, parties, provinces, cities, areas, subAreas] = await Promise.all([
    countOf(getAllSlides(1, 1)),
    countOf(getAllSlides(1, 1, "mediaType", "Digital")),
    getAllSlides(6, 1).then((r) => r.data),
    countOf(getAllParties(1, 0)),
    countOf(getAllProv(1, 0)),
    countOf(getAllCity(1, 0)),
    countOf(getAllArea(1, 0)),
    countOf(getAllSubArea(1, 0)),
  ]);
  return { slides, digital, latest, parties, provinces, cities, areas, subAreas };
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : "—");

const card = "rounded-2xl border border-border-soft bg-bg-surface shadow-soft";

const StatTile = ({ icon: Icon, label, value, detail, to }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`${card} group flex flex-col gap-1 p-4 text-left transition-colors hover:border-brand`}
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
        <Icon fontSize="small" className="text-brand" /> {label}
        <ChevronRightIcon fontSize="small" className="ml-auto text-text-muted transition-transform group-hover:translate-x-0.5" />
      </span>
      <span className="text-3xl font-bold tracking-tight text-text-primary tabular-nums">{value}</span>
      {detail && <span className="text-xs text-text-muted">{detail}</span>}
    </button>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const selectedCount = useSelector((s) => Object.keys(s.slidesForPptx?.selectedSlideIds || {}).length);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 60_000,
  });

  const v = (key) => (isLoading ? "…" : fmt(data?.[key]));
  const staticCount = data ? data.slides - data.digital : null;
  const digitalShare = data?.slides ? Math.round((data.digital / data.slides) * 100) : 0;

  return (
    <section className="flex flex-col gap-4">
      {/* Greeting header — theme tokens only, readable in every theme */}
      <PageHeader
        title={`${greeting()}, ${currentUser?.username || ""}`}
        subtitle={new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        actions={
          <button type="button" className="ui-btn ui-btn--primary" onClick={() => navigate("/slides/create")}>
            <AddIcon fontSize="small" /> Create slide
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="ui-btn" onClick={() => navigate("/slides/list")}>
            <SlidesIcon fontSize="small" /> Browse slides
          </button>
          <button type="button" className="ui-btn" onClick={() => navigate("/party/list")}>
            <PartyIcon fontSize="small" /> Parties
          </button>
        </div>
        <button type="button" className="ui-btn" onClick={() => navigate("/slides/selected_slides")}>
          PPTX queue <span className="ui-btn__count">{selectedCount}</span>
        </button>
      </PageHeader>

      {isError && (
        <div className={`${card} flex items-center justify-between p-4 text-sm text-text-secondary`}>
          Some figures could not be loaded.
          <button type="button" onClick={() => refetch()} className="font-semibold text-brand hover:underline">
            Retry
          </button>
        </div>
      )}

      {/* Inventory */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className={`${card} p-5 lg:col-span-1`}>
          <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <SlidesIcon fontSize="small" className="text-brand" /> Slide inventory
          </div>
          <div className="mt-2 text-4xl font-bold tracking-tight text-text-primary tabular-nums">{v("slides")}</div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-brand-muted">
            <div className="h-full rounded-full bg-brand-accent" style={{ width: `${digitalShare}%` }} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="flex items-center gap-1.5 text-text-muted">
                <span className="h-2 w-2 rounded-full bg-brand-muted ring-1 ring-brand" /> Static
              </dt>
              <dd className="font-semibold text-text-primary tabular-nums">{isLoading ? "…" : fmt(staticCount)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-text-muted">
                <span className="h-2 w-2 rounded-full bg-brand-accent" /> Digital
              </dt>
              <dd className="font-semibold text-text-primary tabular-nums">
                {v("digital")} {data?.slides ? <span className="text-text-muted">({digitalShare}%)</span> : null}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-3">
          <StatTile icon={PartyIcon} label="Parties" value={v("parties")} detail="Suppliers & clients" to="/party/list" />
          <StatTile icon={SetupIcon} label="Provinces" value={v("provinces")} to="/setup/prov/list" />
          <StatTile icon={SetupIcon} label="Cities" value={v("cities")} to="/setup/city/list" />
          <StatTile icon={SetupIcon} label="Areas" value={v("areas")} to="/setup/area/list" />
          <StatTile icon={SetupIcon} label="Sub-areas" value={v("subAreas")} to="/setup/subarea/list" />
          <StatTile
            icon={SlidesIcon}
            label="PPTX queue"
            value={fmt(selectedCount)}
            detail="Slides selected for export"
            to="/slides/selected_slides"
          />
        </div>
      </div>

      {/* Latest slides */}
      <div className={`${card} overflow-hidden`}>
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-base font-bold text-text-primary">Latest slides</h2>
          <button
            type="button"
            onClick={() => navigate("/slides/list")}
            className="text-sm font-semibold text-brand hover:underline"
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="grid-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Location</th>
                <th>Supplier</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-text-muted">Loading…</td>
                </tr>
              ) : !data?.latest?.length ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-text-muted">No slides yet.</td>
                </tr>
              ) : (
                data.latest.map((s) => (
                  <tr
                    key={s._id}
                    onClick={() => navigate(`/slides/edit/${s._id}`)}
                    className="cursor-pointer"
                  >
                    <td><span className="cell-code">{s.code}</span></td>
                    <td className="text-text-secondary">
                      {[s.subArea || s.area, s.city].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="text-text-secondary">{s.supplier || "—"}</td>
                    <td className="text-text-secondary">{s.mediaType || "—"}</td>
                    <td>
                      {s.status ? <StatusBadge status={s.status} /> : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
