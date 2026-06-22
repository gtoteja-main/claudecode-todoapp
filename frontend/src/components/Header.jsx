export default function Header({ activeCount }) {
  return (
    <div style={styles.header}>
      <div style={styles.iconWrap}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <h1 style={styles.title}>My Tasks</h1>
        <p style={styles.sub}>
          {activeCount === 0 ? "All caught up!" : `${activeCount} task${activeCount !== 1 ? "s" : ""} to complete`}
        </p>
      </div>
    </div>
  );
}

const styles = {
  header: {
    background: "linear-gradient(135deg, #3b82f6 0%, #1d6fd8 100%)",
    padding: "28px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  iconWrap: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "white",
    letterSpacing: "-0.3px",
    lineHeight: 1.2,
  },
  sub: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.75)",
    marginTop: "2px",
    fontWeight: "400",
  },
};
