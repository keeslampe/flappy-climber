import { useCallback, useRef, useState } from 'react';
import {
  COMMAND_START_WEIGHT_MEASUREMENT,
  COMMAND_TARE_SCALE,
  CONTROL_POINT_UUID,
  DATA_CHARACTERISTIC_UUID,
  PROGRESSOR_SERVICE,
  RESPONSE_WEIGHT_MEASUREMENT,
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
  const controlCharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  const handleData = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const data = target.value!;
    if (data.getUint8(0) === RESPONSE_WEIGHT_MEASUREMENT) {
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
    const dataCharacteristic = await service.getCharacteristic(DATA_CHARACTERISTIC_UUID);
    const controlChar = await service.getCharacteristic(CONTROL_POINT_UUID);
    controlCharRef.current = controlChar;

    await dataCharacteristic.startNotifications();
    dataCharacteristic.addEventListener('characteristicvaluechanged', handleData);

    await controlChar.writeValue(new Uint8Array([COMMAND_TARE_SCALE]));
    await new Promise((resolve) => setTimeout(resolve, 300));
    await controlChar.writeValue(new Uint8Array([COMMAND_START_WEIGHT_MEASUREMENT]));

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
