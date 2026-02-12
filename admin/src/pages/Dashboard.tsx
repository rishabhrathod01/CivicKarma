export default function Dashboard() {
  return (
    <div>
      <h2 style={styles.title}>Dashboard</h2>

      <div style={styles.grid}>
        <StatCard label="Total Complaints" value="1,234" color="#1a7f37" />
        <StatCard label="Pending" value="342" color="#d97706" />
        <StatCard label="Resolved" value="876" color="#059669" />
        <StatCard label="Active Users" value="2,891" color="#2563eb" />
      </div>

      <p style={styles.note}>Connect to Supabase to see live data</p>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.cardAccent, backgroundColor: color }} />
      <div style={styles.cardBody}>
        <span style={styles.cardLabel}>{label}</span>
        <span style={styles.cardValue}>{value}</span>
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: 24,
    fontWeight: 600,
    margin: '0 0 24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'row',
  },
  cardAccent: {
    width: 5,
    flexShrink: 0,
  },
  cardBody: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1a1a2e',
  },
  note: {
    marginTop: 32,
    padding: '12px 16px',
    backgroundColor: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 8,
    color: '#92400e',
    fontSize: 14,
  },
};
