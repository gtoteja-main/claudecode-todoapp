export default function FilterBar({ filter, setFilter, counts }) {
  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Done" },
  ];

  return (
    <div style={styles.bar}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setFilter(tab.key)}
          style={{ ...styles.tab, ...(filter === tab.key ? styles.tabActive : {}) }}
        >
          {tab.label}
          <span style={{ ...styles.badge, ...(filter === tab.key ? styles.badgeActive : {}) }}>
            {counts[tab.key]}
          </span>
        </button>
      ))}
    </div>
  );
}

const styles = {
  bar: {
    display: "flex",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "4px",
    gap: "4px",
  },
  tab: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "9px",
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.7)",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s",
    fontFamily: "Inter, sans-serif",
  },
  tabActive: {
    background: "white",
    color: "#667eea",
    fontWeight: "600",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  badge: {
    fontSize: "12px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "20px",
    padding: "1px 7px",
    color: "rgba(255,255,255,0.8)",
  },
  badgeActive: {
    background: "#ede9fe",
    color: "#7c3aed",
  },
};
