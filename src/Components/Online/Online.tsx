import React from 'react';
import { OnlineIndicatorProps } from './OnlineProps';

export function Online({
  online,
  innerSize = 10,
  outerSize = 16,
  topOffset = -4,
  rightOffset = 10,
}: OnlineIndicatorProps): React.JSX.Element {
  const outerStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: '#000', // fallback background color
    width: outerSize,
    height: outerSize,
    borderRadius: outerSize,
    right: rightOffset,
    top: topOffset,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const innerStyle: React.CSSProperties = {
    width: innerSize,
    height: innerSize,
    borderRadius: innerSize,
    backgroundColor: online ?'#00C851': '#ccc'  , // green if online, grey if offline
  };

  return (
    <div style={outerStyle}>
      <div style={innerStyle} />
    </div>
  );
}
