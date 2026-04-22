import { useRef } from 'react';
import { PhaserGame } from './PhaserGame';
import type { IRefPhaserGame } from './PhaserGame';

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    return <PhaserGame ref={phaserRef} />;
}

export default App;
