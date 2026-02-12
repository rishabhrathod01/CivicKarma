export default function Export() {
  return (
    <div>
      <h2 style={styles.title}>Export Data</h2>

      <p style={styles.description}>
        Export complaint data as CSV or JSON for analysis, reporting, or
        integration with external systems. Select a date range and category
        to filter the exported data.
      </p>

      {/* Filters */}
      <div style={styles.card}>
        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Start Date</label>
            <input type="date" style={styles.input} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>End Date</label>
            <input type="date" style={styles.input} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <select style={styles.input}>
              <option value="">All Categories</option>
              <option value="bbmp">BBMP</option>
              <option value="traffic">Traffic</option>
              <option value="road_infra">Road &amp; Infrastructure</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Status</label>
            <select style={styles.input}>
              <option value="">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="forwarded">Forwarded</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div style={styles.actions}>
          <button style={styles.btnPrimary}>Export CSV</button>
          <button style={styles.btnSecondary}>Export JSON</button>
        </div>
      </div>

      <p style={styles.note}>
        Export functionality will be connected to Supabase
      </p>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: 24,
    fontWeight: 600,
    margin: '0 0 12px',
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 1.6,
    marginBottom: 24,
    maxWidth: 640,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 28,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 20,
    marginBottom: 24,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    fontSize: 14,
    color: '#374151',
    backgroundColor: '#fff',
  },
  actions: {
    display: 'flex',
    gap: 12,
  },
  btnPrimary: {
    padding: '10px 20px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#1a7f37',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '10px 20px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    color: '#374151',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
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
