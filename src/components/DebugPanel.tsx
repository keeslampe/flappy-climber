interface Props {
  raw: number;
  smooth: number;
  connected: boolean;
}

export function DebugPanel({ raw, smooth, connected }: Props) {
  return (
    <div className="debug-panel" style={{ display: 'block' }}>
      <div className="debug-inner">
        <div>TINDEQ RAW &nbsp; : <span style={{ color: '#FFF6E5' }}>{raw.toFixed(2)} kg</span></div>
        <div>TINDEQ SMOOTH: <span style={{ color: '#FFF6E5' }}>{smooth.toFixed(2)} kg</span></div>
        <div>CONNECTED &nbsp; &nbsp; : <span style={{ color: connected ? '#7BE38C' : '#FF3D8A' }}>{connected ? '✓ yes' : '✗ no'}</span></div>
      </div>
    </div>
  );
}
