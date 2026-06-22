const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export default function FilterBar({ filter, setFilter, counts }) {
  return (
    <div style={styles.wrap}>
      {TABS.map((tab) => {
        const isActive = filter === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{ ...styles.tab, ...(isActive ? styles.tabActive : {}) }}
          >
            {tab.label}
            <span style={{ ...styles.count, ...(isActive ? styles.countActive : {}) }}>
              {counts[tab.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    gap: "4px",
    background: "#f0f7ff",
    borderRadius: "12px",
    padding: "4px",
  },
  tab: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "9px",
    border: "none",
    background: "transparent",
    color: "#7aa3c8",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.15s",
  },
  tabActive: {
    background: "white",
    color: "#1d6fd8",
    fontWeight: "600",
    boxShadow: "0 1px 4px rgba(59,130,246,0.15)",
  },
  count: {
    fontSize: "11px",
    fontWeight: "600",
    background: "#dbeeff",
    color: "#7aa3c8",
    borderRadius: "20px",
    padding: "1px 6px",
    minWidth: "20px",
    textAlign: "center",
  },
  countActive: {
    background: "#dbeeff",
    color: "#1d6fd8",
  },
};
