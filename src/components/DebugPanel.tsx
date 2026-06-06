interface Props {
  raw: number;
  smooth: number;
  connected: boolean;
  showTargetLine: boolean;
  setShowTargetLine: (value: boolean) => void;
}

export function DebugPanel({ raw, smooth, connected, showTargetLine, setShowTargetLine }: Props) {
  return (
    <div className="debug-panel" style={{ display: 'block' }}>
      <div className="debug-inner">
        <div>TINDEQ RAW &nbsp; : <span style={{ color: '#FFF6E5' }}>{raw.toFixed(2)} kg</span></div>
        <div>TINDEQ SMOOTH: <span style={{ color: '#FFF6E5' }}>{smooth.toFixed(2)} kg</span></div>
        <div>CONNECTED &nbsp; &nbsp; : <span style={{ color: connected ? '#7BE38C' : '#FF3D8A' }}>{connected ? '✓ yes' : '✗ no'}</span></div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 6,
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          <input
            type="checkbox"
            checked={showTargetLine}
            onChange={(event) => setShowTargetLine(event.target.checked)}
            style={{ accentColor: '#1FD5C8', width: 13, height: 13, cursor: 'pointer' }}
          />{' '}
          TARGET LINE
        </label>
      </div>
    </div>
  );
}
