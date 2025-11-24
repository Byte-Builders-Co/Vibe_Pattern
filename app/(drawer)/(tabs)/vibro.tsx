import { ActionButtons } from "@/src/components/vibro/ActionButtons";
import { PatternGridModal } from "@/src/components/vibro/PatternGridModal";
import { PatternSelector } from "@/src/components/vibro/PatternSelector";
import { SpeedControls } from "@/src/components/vibro/SpeedControls";
import { VibrationPlayer } from "@/src/components/vibro/VibrationPlayer";
import { getVibrationPatterns } from "@/src/services/loadPatterns";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function VibroScreen() {
  const patterns = getVibrationPatterns();
  const [selIdx, setSelIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [showList, setShowList] = useState(false);

  const selPat = patterns[selIdx];

  useEffect(() => {
    setSpeed(1);
    if (playing) {
      setPlaying(false);
    }
  }, [selIdx]);

  const toggle = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const changeSpeed = useCallback(
    (s: number) => {
      const was = playing;
      if (playing) {
        setPlaying(false);
      }
      setSpeed(s);
      if (was) {
        setTimeout(() => {
          setPlaying(true);
        }, 50);
      }
    },
    [playing]
  );

  const openList = useCallback(() => {
    setShowList(true);
  }, []);

  const closeList = useCallback(() => {
    setShowList(false);
  }, []);

  const selectPat = useCallback(
    (i: number) => {
      if (playing) setPlaying(false);
      setSelIdx(i);
    },
    [playing]
  );

  const selectFromGrid = useCallback(
    (i: number) => {
      if (playing) setPlaying(false);
      setSelIdx(i);
      closeList();
    },
    [playing, closeList]
  );

  return (
    <View style={styles.root}>
      <PatternSelector
        patterns={patterns}
        selectedIndex={selIdx}
        onSelectPattern={selectPat}
      />
      <VibrationPlayer
        pattern={selPat}
        playing={playing}
        speed={speed}
        onToggle={toggle}
      />

      <ActionButtons onOpenList={openList} />

      <SpeedControls speed={speed} onChangeSpeed={changeSpeed} />

      <PatternGridModal
        visible={showList}
        patterns={patterns}
        selectedIndex={selIdx}
        onClose={closeList}
        onSelectPattern={selectFromGrid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fafafa" },
});
