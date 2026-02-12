export default function Complaints() {
  return (
    <div>
      <h2 style={styles.title}>Complaints</h2>

      {/* Filter bar */}
      <div style={styles.filterBar}>
        <select style={styles.select}>
          <option value="">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="forwarded">Forwarded</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select style={styles.select}>
          <option value="">All Categories</option>
          <option value="bbmp">BBMP</option>
          <option value="traffic">Traffic</option>
          <option value="road_infra">Road &amp; Infrastructure</option>
        </select>

        <select style={styles.select}>
          <option value="">All Wards</option>
          <option value="ward1">Ward 1</option>
          <option value="ward2">Ward 2</option>
          <option value="ward3">Ward 3</option>
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['ID', 'Category', 'Status', 'Location', 'Date', 'Actions'].map(
                (header) => (
                  <th key={header} style={styles.th}>
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {mockComplaints.map((c) => (
              <tr key={c.id}>
                <td style={styles.td}>
                  <code style={styles.code}>{c.id}</code>
                </td>
                <td style={styles.td}>{c.category}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...statusColor(c.status) }}>
                    {c.status}
                  </span>
                </td>
                <td style={styles.td}>{c.location}</td>
                <td style={styles.td}>{c.date}</td>
                <td style={styles.td}>
                  <button style={styles.actionBtn}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={styles.note}>Connect to Supabase to see live data</p>
    </div>
  );
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockComplaints = [
  {
    id: 'a1b2c3d4',
    category: 'BBMP — Garbage',
    status: 'submitted',
    location: 'Koramangala 4th Block',
    date: '2026-02-10',
  },
  {
    id: 'e5f6g7h8',
    category: 'Traffic — Illegal Parking',
    status: 'forwarded',
    location: 'MG Road / Brigade Road Junction',
    date: '2026-02-09',
  },
  {
    id: 'i9j0k1l2',
    category: 'Road & Infra — Potholes',
    status: 'resolved',
    location: 'Outer Ring Road, Marathahalli',
    date: '2026-02-07',
  },
];

function statusColor(
  status: string
): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    submitted: { backgroundColor: '#dbeafe', color: '#1e40af' },
    forwarded: { backgroundColor: '#fef3c7', color: '#92400e' },
    acknowledged: { backgroundColor: '#e0e7ff', color: '#3730a3' },
    resolved: { backgroundColor: '#d1fae5', color: '#065f46' },
    rejected: { backgroundColor: '#fee2e2', color: '#991b1b' },
  };
  return map[status] ?? { backgroundColor: '#f3f4f6', color: '#374151' };
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: 24,
    fontWeight: 600,
    margin: '0 0 24px',
  },
  filterBar: {
    display: 'flex',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  select: {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#374151',
    cursor: 'pointer',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '2px solid #e5e7eb',
    fontWeight: 600,
    color: '#6b7280',
    fontSize: 12,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle',
  },
  code: {
    fontFamily: '"SF Mono", "Fira Code", "Fira Mono", Menlo, monospace',
    fontSize: 12,
    backgroundColor: '#f3f4f6',
    padding: '2px 6px',
    borderRadius: 4,
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'capitalize' as const,
  },
  actionBtn: {
    padding: '5px 12px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    color: '#374151',
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: 500,
  },
  note: {
    marginTop: 24,
    padding: '12px 16px',
    backgroundColor: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 8,
    color: '#92400e',
    fontSize: 14,
  },
};
