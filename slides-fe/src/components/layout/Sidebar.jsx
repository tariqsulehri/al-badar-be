import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "../icons";
import { visibleNavItems, isPathActive, initialsOf } from "./navConfig";

const itemBase =
  "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] font-medium transition-colors duration-150";
const itemIdle = "text-text-secondary hover:bg-brand-muted hover:text-text-primary";
const itemActive = "bg-brand-muted text-brand-strong font-semibold";

const ActiveBar = () => (
  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-brand" aria-hidden="true" />
);

const Sidebar = ({ currentUser, collapsed, mobileOpen, onCloseMobile }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const items = visibleNavItems(currentUser?.role);

  const groupHasActiveChild = (item) => item.children?.some((c) => isPathActive(pathname, c));

  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(items.filter(groupHasActiveChild).map((i) => [i.key, true]))
  );

  // Expand the group that owns the current page whenever the route changes.
  useEffect(() => {
    const active = items.find(groupHasActiveChild);
    if (active) setOpenGroups((prev) => (prev[active.key] ? prev : { ...prev, [active.key]: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute on navigation only
  }, [pathname]);

  const toggleGroup = (item) => {
    // Icon-only rail can't show sub-items: jump to the group's first page instead.
    if (collapsed) {
      navigate(item.children[0].to);
      onCloseMobile();
      return;
    }
    setOpenGroups((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
  };

  const width = collapsed ? "lg:w-[76px]" : "lg:w-[264px]";

  return (
    <aside
      className={`app-sidebar fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-border-soft bg-bg-surface-strong pt-16 transition-[transform,width] duration-200 lg:sticky lg:top-16 lg:z-20 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:pt-0 ${width} ${
        mobileOpen ? "translate-x-0 shadow-strong" : "-translate-x-full"
      }`}
      aria-label="Main navigation"
    >
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon;

            if (!item.children) {
              const active = isPathActive(pathname, item);
              return (
                <li key={item.key}>
                  <NavLink
                    to={item.to}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={`${itemBase} ${active ? itemActive : itemIdle} ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {active && <ActiveBar />}
                    <Icon fontSize="small" className="shrink-0" />
                    <span className={`truncate ${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
                    {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />}
                  </NavLink>
                </li>
              );
            }

            const childActive = groupHasActiveChild(item);
            const open = !collapsed && openGroups[item.key];

            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item)}
                  title={collapsed ? item.label : undefined}
                  aria-expanded={collapsed ? undefined : Boolean(open)}
                  className={`${itemBase} ${childActive ? "text-brand-strong font-semibold" : itemIdle} ${
                    childActive && collapsed ? "lg:bg-brand-muted" : ""
                  } ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
                >
                  {childActive && collapsed && <ActiveBar />}
                  <Icon fontSize="small" className="shrink-0" />
                  <span className={`truncate ${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
                  <ChevronRightIcon
                    fontSize="small"
                    className={`ml-auto text-text-muted transition-transform duration-150 ${open ? "rotate-90" : ""} ${
                      collapsed ? "lg:hidden" : ""
                    }`}
                  />
                </button>

                {open && (
                  <ul className="mt-1 mb-1 ml-[22px] flex flex-col gap-0.5 border-l border-border-soft pl-3">
                    {item.children.map((child) => {
                      const active = isPathActive(pathname, child);
                      return (
                        <li key={child.to}>
                          <NavLink
                            to={child.to}
                            onClick={onCloseMobile}
                            aria-current={active ? "page" : undefined}
                            className={`relative block rounded-lg px-3 py-2 text-[13.5px] transition-colors duration-150 ${
                              active
                                ? "bg-brand-muted font-semibold text-brand-strong"
                                : "text-text-secondary hover:bg-brand-muted hover:text-text-primary"
                            }`}
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {currentUser && (
        <div className="border-t border-border-soft p-3">
          <div
            className={`flex items-center gap-3 rounded-xl bg-brand-muted/60 p-2.5 ${collapsed ? "lg:justify-center lg:p-2" : ""}`}
            title={collapsed ? `${currentUser.username} · ${currentUser.role}` : undefined}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-[13px] font-bold text-on-brand">
              {initialsOf(currentUser)}
            </span>
            <div className={`min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
              <p className="truncate text-sm font-semibold text-text-primary">{currentUser.username}</p>
              <p className="truncate text-xs text-text-muted">
                <span className="uppercase tracking-wide">{currentUser.role}</span>
                {currentUser.email ? ` · ${currentUser.email}` : ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  currentUser: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  collapsed: PropTypes.bool,
  mobileOpen: PropTypes.bool,
  onCloseMobile: PropTypes.func.isRequired,
};

export default Sidebar;
