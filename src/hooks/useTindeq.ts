import { useCallback, useRef, useState } from 'react';
import {
  CMD_START_WEIGHT_MEAS,
  CMD_TARE_SCALE,
  CTRL_POINT_UUID,
  DATA_CHAR_UUID,
  PROGRESSOR_SERVICE,
  RES_WEIGHT_MEAS,
} from '../game/constants';

interface UseTindeq {
  bluetoothAvailable: boolean;
  connected: boolean;
  connect: () => Promise<void>;
  /** Current raw kg reading (mutated each notification). */
  readingRef: React.MutableRefObject<number>;
}

export function useTindeq(): UseTindeq {
  const [connected, setConnected] = useState(false);
  const readingRef = useRef(0);
  const ctrlCharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  const handleData = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const data = target.value!;
    if (data.getUint8(0) === RES_WEIGHT_MEAS) {
      // Each measurement is 8 bytes: float32 weight + uint32 timestamp (LE)
      for (let i = 2; i + 4 <= data.byteLength; i += 8) {
        readingRef.current = Math.max(0, data.getFloat32(i, true));
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (!navigator.bluetooth) return;
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'Progressor' }],
      optionalServices: [PROGRESSOR_SERVICE],
    });
    if (!device.gatt) throw new Error('No GATT');
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(PROGRESSOR_SERVICE);
    const dataChar = await service.getCharacteristic(DATA_CHAR_UUID);
    const ctrlChar = await service.getCharacteristic(CTRL_POINT_UUID);
    ctrlCharRef.current = ctrlChar;

    await dataChar.startNotifications();
    dataChar.addEventListener('characteristicvaluechanged', handleData);

    await ctrlChar.writeValue(new Uint8Array([CMD_TARE_SCALE]));
    await new Promise((r) => setTimeout(r, 300));
    await ctrlChar.writeValue(new Uint8Array([CMD_START_WEIGHT_MEAS]));

    setConnected(true);
    device.addEventListener('gattserverdisconnected', () => {
      setConnected(false);
      readingRef.current = 0;
    });
  }, [handleData]);

  return {
    bluetoothAvailable: typeof navigator !== 'undefined' && !!navigator.bluetooth,
    connected,
    connect,
    readingRef,
  };
}
