import { getVibrationPatterns } from "@/src/services/loadPatterns";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");
const CENTER = 145;
const RINGS = 26;
const ARC_R = 140;
const ARC_SIZE = 50;
const ARC_VIS = 5;

export default function VibroScreen() {
  const patterns = getVibrationPatterns();
  const [selIdx, setSelIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showList, setShowList] = useState(false);
  const [arcOffset, setArcOffset] = useState(0);

  const pulse = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;
  const menu = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  const intRef = useRef<any>(null);
  const animRef = useRef<Animated.CompositeAnimation[]>([]);
  const lastX = useRef(0);

  const selPat = patterns[selIdx];
  const maxOff = Math.max(0, patterns.length - ARC_VIS);

  useEffect(() => {
    setSpeed(1);
    if (playing) stopVib();
  }, [selIdx]);

  useEffect(() => {
    if (menuOpen) {
      const t = Math.max(0, Math.min(maxOff, selIdx - Math.floor(ARC_VIS / 2)));
      setArcOffset(t);
    }
  }, [menuOpen, selIdx]);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5,
      onPanResponderGrant: () => {
        lastX.current = arcOffset;
      },
      onPanResponderMove: (_, g) => {
        const n = lastX.current - g.dx * 0.02;
        setArcOffset(Math.max(0, Math.min(maxOff, n)));
      },
      onPanResponderRelease: () => setArcOffset(Math.round(arcOffset)),
    })
  ).current;

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
  }, [playing, speed]);

  const stopVib = useCallback(() => {
    intRef.current && clearInterval(intRef.current);
    intRef.current = null;
    Vibration.cancel();
    setPlaying(false);
  }, []);

  const startVib = useCallback(() => {
    if (!selPat) return;
    const pat = selPat.pattern.map((d: number) =>
      Math.max(10, Math.round(d / speed))
    );
    setPlaying(true);
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
  }, [selPat, speed]);

  const toggle = () => (playing ? stopVib() : startVib());

  const changeSpeed = useCallback(
    (s: number) => {
      const was = playing;
      if (playing) stopVib();
      setSpeed(s);
      if (was)
        setTimeout(() => {
          if (!selPat) return;
          const pat = selPat.pattern.map((d: number) =>
            Math.max(10, Math.round(d / s))
          );
          setPlaying(true);
          Vibration.vibrate(pat, true);
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
        }, 50);
    },
    [playing, selPat, stopVib]
  );

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(menu, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.spring(menu, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  };

  const openList = () => {
    setShowList(true);
    Animated.spring(modalAnim, {
      toValue: 1,
      friction: 8,
      tension: 65,
      useNativeDriver: true,
    }).start();
  };

  const closeList = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowList(false));
  };

  const selectPat = (i: number) => {
    if (playing) stopVib();
    setSelIdx(i);
    toggleMenu();
  };

  const selectFromGrid = (i: number) => {
    if (playing) stopVib();
    setSelIdx(i);
    closeList();
  };

  const prev = () => {
    if (playing) stopVib();
    setSelIdx((p) => (p > 0 ? p - 1 : patterns.length - 1));
  };
  const next = () => {
    if (playing) stopVib();
    setSelIdx((p) => (p < patterns.length - 1 ? p + 1 : 0));
  };

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
            S.sq,
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

  const getPatIcon = (pattern: any) => {
    return pattern?.icon || "📊";
  };

  const arcMenu = () => {
    if (!menuOpen) return null;
    return (
      <View style={S.arcWrap}>
        <TouchableOpacity
          style={S.arcBg}
          onPress={toggleMenu}
          activeOpacity={1}
        />
        <View style={S.arcIn} {...pan.panHandlers}>
          {/* Semi-circle background */}
          <View style={S.arcSemiCircle} />
          {patterns.map((it, i) => {
            const pos = i - arcOffset;
            if (pos < -0.5 || pos > ARC_VIS - 0.5) return null;
            const ctr = (ARC_VIS - 1) / 2;
            const spread = Math.PI * 0.75;
            const step = spread / (ARC_VIS - 1);
            const ang = Math.PI / 2 + spread / 2 - pos * step;
            const x = ARC_R * Math.cos(ang);
            const y = ARC_R * Math.sin(ang);
            const d = Math.abs(pos - ctr);
            const sc = 1 - d * 0.12;
            const op = 1 - d * 0.25;
            const sel = selIdx === i;
            const isPremium = it.premium || false;
            return (
              <Animated.View
                key={it.id}
                style={[
                  S.arcIt,
                  {
                    transform: [
                      {
                        translateX: menu.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, x],
                        }),
                      },
                      {
                        translateY: menu.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -y],
                        }),
                      },
                      {
                        scale: menu.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.15, sc],
                        }),
                      },
                    ],
                    opacity: menu.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, op],
                    }),
                  },
                ]}
              >
                <TouchableOpacity
                  style={[S.arcBtn, sel && S.arcSel, isPremium && S.arcPremium]}
                  onPress={() => selectPat(i)}
                >
                  {isPremium && !sel && (
                    <View style={S.arcPremiumBadge}>
                      <Text style={S.arcPremiumIcon}>👑</Text>
                    </View>
                  )}
                  <Text style={[S.arcTxt, sel && S.arcTxtS]}>
                    {sel ? "✓" : i + 1}
                  </Text>
                </TouchableOpacity>
                <View style={[S.arcLbl, sel && S.arcLblSel]}>
                  <Text
                    style={[S.arcLblT, sel && S.arcLblTSel]}
                    numberOfLines={1}
                  >
                    {it.name}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </View>
        {arcOffset > 0 && (
          <TouchableOpacity
            style={[S.arcNav, S.arcL]}
            onPress={() => setArcOffset(Math.max(0, arcOffset - 1))}
          >
            <Text style={S.arcNavT}>‹</Text>
          </TouchableOpacity>
        )}
        {arcOffset < maxOff && (
          <TouchableOpacity
            style={[S.arcNav, S.arcR]}
            onPress={() => setArcOffset(Math.min(maxOff, arcOffset + 1))}
          >
            <Text style={S.arcNavT}>›</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPatternGrid = () => (
    <Modal visible={showList} transparent animationType="none">
      <View style={S.modalBg}>
        <Animated.View
          style={[
            S.modalBox,
            {
              transform: [
                {
                  translateY: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [SH, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={S.modalHead}>
            <Text style={S.modalTitle}>Patterns</Text>
            <TouchableOpacity style={S.closeBtn} onPress={closeList}>
              <Text style={S.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={S.gridScroll} showsVerticalScrollIndicator={false}>
            <View style={S.grid}>
              {patterns.map((p, i) => {
                const isSel = selIdx === i;
                const isLocked = p.premium || false;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={S.gridItem}
                    onPress={() => !isLocked && selectFromGrid(i)}
                    activeOpacity={isLocked ? 0.6 : 0.8}
                  >
                    <View
                      style={[
                        S.gridCircle,
                        isSel && S.gridCircleSel,
                        isLocked && S.gridLocked,
                      ]}
                    >
                      {isLocked ? (
                        <View style={S.lockContainer}>
                          <Text style={S.lockIco}>🔒</Text>
                          <Text style={S.premiumBadge}>👑</Text>
                        </View>
                      ) : (
                        <Text style={S.gridIco}>{getPatIcon(p)}</Text>
                      )}
                    </View>
                    <Text
                      style={[S.gridName, isSel && S.gridNameSel]}
                      numberOfLines={1}
                    >
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View style={S.root}>
      <View style={S.head}>
        <Text style={S.title}>Vibro</Text>
      </View>

      <View style={S.main}>
        <View style={S.spiral}>
          {playing && (
            <>
              <Animated.View
                style={[S.wave, { transform: [{ scale: w1S }], opacity: w1O }]}
              />
              <Animated.View
                style={[S.wave, { transform: [{ scale: w2S }], opacity: w2O }]}
              />
              <Animated.View
                style={[S.wave, { transform: [{ scale: w3S }], opacity: w3O }]}
              />
            </>
          )}
          <Animated.View
            style={[S.spiralIn, { transform: [{ rotate: rotVal }] }]}
          >
            {squares}
          </Animated.View>
          <Animated.View style={[S.center, { transform: [{ scale: pulse }] }]}>
            <TouchableOpacity
              style={S.playBtn}
              onPress={toggle}
              activeOpacity={0.8}
            >
              <Text style={S.playIco}>{playing ? "⏸" : "▶"}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <TouchableOpacity style={[S.nav, S.navL]} onPress={prev}>
          <Text style={S.navT}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[S.nav, S.navR]} onPress={next}>
          <Text style={S.navT}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={S.actionRow}>
        <TouchableOpacity style={S.actBtn} onPress={openList}>
          <Text style={S.actIco}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity style={S.actBtn}>
          <Text style={S.actIco}>🔓</Text>
        </TouchableOpacity>
      </View>

      <View style={S.spdBox}>
        <View style={S.spdRow}>
          {[1, 2, 3].map((s) => (
            <TouchableOpacity
              key={s}
              style={[S.spdBtn, speed === s && S.spdAct]}
              onPress={() => changeSpeed(s)}
            >
              <Text style={[S.spdTxt, speed === s && S.spdTxtA]}>{s}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[S.spdBtn, S.spdPrem]}
            onPress={() => changeSpeed(4)}
          >
            <Text style={S.premIco}>👑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[S.spdBtn, S.spdPrem]}
            onPress={() => changeSpeed(5)}
          >
            <Text style={S.premIco}>👑</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={S.fabBox}>
        {arcMenu()}
        <TouchableOpacity
          style={[S.fab, menuOpen && S.fabAct]}
          onPress={toggleMenu}
          activeOpacity={0.85}
        >
          <Animated.Text
            style={[
              S.fabIco,
              {
                transform: [
                  {
                    rotate: menu.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "45deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            +
          </Animated.Text>
        </TouchableOpacity>
      </View>

      {renderPatternGrid()}
    </View>
  );
}

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fafafa" },
  head: { paddingTop: 50, paddingBottom: 8, paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: "300", color: "#c9b8cf" },

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

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  actBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f4f4f5",
    justifyContent: "center",
    alignItems: "center",
  },
  actIco: { fontSize: 18, color: "#a1a1aa" },

  spdBox: { paddingHorizontal: 24, paddingBottom: 14 },
  spdRow: {
    flexDirection: "row",
    backgroundColor: "#f4f4f5",
    borderRadius: 26,
    padding: 4,
  },
  spdBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 22,
  },
  spdAct: { backgroundColor: "#ede9fe" },
  spdTxt: { fontSize: 15, fontWeight: "600", color: "#a1a1aa" },
  spdTxtA: { color: "#a855f7" },
  spdPrem: { backgroundColor: "#a855f7" },
  premIco: { fontSize: 14 },

  fabBox: { alignItems: "center", paddingBottom: 36 },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#a855f7",
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  fabAct: { backgroundColor: "#7c3aed" },
  fabIco: { fontSize: 28, color: "#fff", fontWeight: "400" },

  arcWrap: {
    position: "absolute",
    bottom: 0,
    width: SW,
    height: ARC_R + 80,
    alignItems: "center",
  },
  arcBg: { ...StyleSheet.absoluteFillObject },
  arcIn: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  arcSemiCircle: {
    position: "absolute",
    bottom: 0,
    width: ARC_R * 2.2,
    height: ARC_R * 1.1,
    borderTopLeftRadius: ARC_R * 1.1,
    borderTopRightRadius: ARC_R * 1.1,
    backgroundColor: "#f8f4ff",
    borderWidth: 2,
    borderColor: "#c084fc",
    borderBottomWidth: 0,
    opacity: 0.95,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  arcIt: { position: "absolute", alignItems: "center", bottom: 0 },
  arcBtn: {
    width: ARC_SIZE,
    height: ARC_SIZE,
    borderRadius: ARC_SIZE / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 2.5,
    borderColor: "#e5e7eb",
    overflow: "visible",
  },
  arcSel: {
    backgroundColor: "#a855f7",
    borderColor: "#7c3aed",
    transform: [{ scale: 1.1 }],
  },
  arcPremium: {
    borderColor: "#fbbf24",
  },
  arcPremiumBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fbbf24",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  arcPremiumIcon: {
    fontSize: 10,
  },
  arcTxt: { fontSize: 14, fontWeight: "700", color: "#6b7280" },
  arcTxtS: { color: "#fff" },
  arcLbl: {
    marginTop: 6,
    backgroundColor: "#1f2937",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: 70,
  },
  arcLblSel: {
    backgroundColor: "#a855f7",
  },
  arcLblT: {
    fontSize: 9,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  arcLblTSel: {
    color: "#fff",
  },
  arcNav: {
    position: "absolute",
    bottom: 60,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    borderWidth: 2,
    borderColor: "#c084fc",
  },
  arcL: { left: SW / 2 - ARC_R - 45 },
  arcR: { right: SW / 2 - ARC_R - 45 },
  arcNavT: { fontSize: 18, color: "#a855f7", fontWeight: "300" },

  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  modalBox: {
    flex: 1,
    marginTop: 60,
    backgroundColor: "#fafafa",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 20,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "300",
    color: "#c9b8cf",
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  closeTxt: { fontSize: 15, color: "#6b7280" },
  gridScroll: { flex: 1 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  gridItem: {
    width: (SW - 48) / 3,
    alignItems: "center",
    marginBottom: 20,
  },
  gridCircle: {
    width: (SW - 80) / 3,
    height: (SW - 80) / 3,
    borderRadius: (SW - 80) / 6,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  gridCircleSel: {
    borderWidth: 4,
    borderColor: "#a855f7",
    backgroundColor: "#f8f4ff",
  },
  gridLocked: {
    backgroundColor: "#e9d5ff",
    opacity: 0.8,
    borderColor: "#d8b4fe",
  },
  gridIco: { fontSize: 28 },
  lockContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  lockIco: { fontSize: 24 },
  premiumBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    fontSize: 14,
  },
  gridName: {
    fontSize: 11,
    color: "#a1a1aa",
    marginTop: 6,
    textAlign: "center",
  },
  gridNameSel: { color: "#7c3aed", fontWeight: "600" },
});
