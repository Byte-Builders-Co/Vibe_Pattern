import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");
const CENTER = 145;
const RINGS = 26;

type VibrationPlayerProps = {
  pattern: any;
  playing: boolean;
  speed: number;
  onToggle: () => void;
};

export const VibrationPlayer: React.FC<VibrationPlayerProps> = ({
  pattern,
  playing,
  speed,
  onToggle,
}) => {
  const pulse = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;

  const intRef = useRef<any>(null);
  const animRef = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(
    () => () => {
      intRef.current && clearInterval(intRef.current);
      animRef.current.forEach((a) => a.stop());
      Vibration.cancel();
    },
    []
  );

  useEffect(() => {
    animRef.current.forEach((a) => a.stop());
    animRef.current = [];
    if (playing) {
      const w1 = Animated.loop(
        Animated.sequence([
          Animated.timing(wave1, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(wave1, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      const w2 = Animated.loop(
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(wave2, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(wave2, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      const w3 = Animated.loop(
        Animated.sequence([
          Animated.delay(800),
          Animated.timing(wave3, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(wave3, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      const rot = Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 6000 / speed,
          useNativeDriver: true,
        })
      );
      animRef.current = [w1, w2, w3, rot];
      w1.start();
      w2.start();
      w3.start();
      rot.start();
    } else {
      wave1.setValue(0);
      wave2.setValue(0);
      wave3.setValue(0);
    }
  }, [playing, speed, wave1, wave2, wave3, rotate]);

  const stopVib = useCallback(() => {
    intRef.current && clearInterval(intRef.current);
    intRef.current = null;
    Vibration.cancel();
  }, []);

  const startVib = useCallback(() => {
    if (!pattern) return;
    const pat = pattern.pattern.map((d: number) =>
      Math.max(10, Math.round(d / speed))
    );
    Vibration.vibrate(pat, true);
    intRef.current && clearInterval(intRef.current);
    intRef.current = setInterval(() => {
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.05,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 350);
  }, [pattern, speed, pulse]);

  useEffect(() => {
    if (playing) {
      startVib();
    } else {
      stopVib();
    }
    return () => {
      stopVib();
    };
  }, [playing, startVib, stopVib]);

  const rotVal = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const w1S = wave1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
  const w1O = wave1.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0.4, 0.18, 0],
  });
  const w2S = wave2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
  const w2O = wave2.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0.4, 0.18, 0],
  });
  const w3S = wave3.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
  const w3O = wave3.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0.4, 0.18, 0],
  });

  const squares = useMemo(() => {
    const arr = [];
    for (let i = 0; i < RINGS; i++) {
      const ang = (i / RINGS) * 360;
      const sz = 28 + (i % 5) * 4;
      const dist = CENTER / 2 + 42 + Math.sin(i * 0.5) * 6;
      arr.push(
        <View
          key={i}
          style={[
            styles.sq,
            {
              width: sz,
              height: sz,
              transform: [
                { rotate: `${ang + i * 10}deg` },
                { translateY: -dist },
              ],
              opacity: 0.18 + (i % 4) * 0.08,
            },
          ]}
        />
      );
    }
    return arr;
  }, []);

  return (
    <View style={styles.main}>
      <View style={styles.spiral}>
        {playing && (
          <>
            <Animated.View
              style={[
                styles.wave,
                { transform: [{ scale: w1S }], opacity: w1O },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                { transform: [{ scale: w2S }], opacity: w2O },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                { transform: [{ scale: w3S }], opacity: w3O },
              ]}
            />
          </>
        )}
        <Animated.View
          style={[styles.spiralIn, { transform: [{ rotate: rotVal }] }]}
        >
          {squares}
        </Animated.View>
        <Animated.View
          style={[styles.center, { transform: [{ scale: pulse }] }]}
        >
          <TouchableOpacity
            style={styles.playBtn}
            onPress={onToggle}
            activeOpacity={0.8}
          >
            <Text style={styles.playIco}>{playing ? "|=|" : "▶"}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, justifyContent: "center", alignItems: "center" },
  spiral: {
    width: SW * 0.78,
    height: SW * 0.78,
    justifyContent: "center",
    alignItems: "center",
  },
  spiralIn: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sq: {
    position: "absolute",
    borderWidth: 1.2,
    borderColor: "#a855f7",
    borderRadius: 2,
  },
  wave: {
    position: "absolute",
    width: CENTER + 30,
    height: CENTER + 30,
    borderRadius: (CENTER + 30) / 2,
    backgroundColor: "#ede9fe",
    borderWidth: 2,
    borderColor: "#c084fc",
  },
  center: {
    width: CENTER,
    height: CENTER,
    borderRadius: CENTER / 2,
    backgroundColor: "#f8f4ff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    borderWidth: 3,
    borderColor: "#c084fc",
  },
  playBtn: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  playIco: { fontSize: 42, color: "#a855f7" },
  nav: { position: "absolute", top: "50%", marginTop: -22, padding: 10 },
  navL: { left: 6 },
  navR: { right: 6 },
  navT: { fontSize: 34, color: "#d1d5db", fontWeight: "200" },
});
