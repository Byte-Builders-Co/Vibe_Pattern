import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import musicData from "../../../../../assets/data/musicData.json";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - 80) / 3;

type MusicTrack = {
  id: string;
  name: string;
  backgroundColor: string;
  imageUrl: string;
  musicUrl: string;
  locked: boolean;
};

export default function UserHomeScreen() {
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load tracks from JSON and add locked property (first 3 unlocked, rest locked)
  const musicTracks = useMemo(() => {
    return musicData.musicTracks.map((track: any, index: number) => ({
      ...track,
      locked: index >= 3, // First 3 unlocked, rest locked
    })) as MusicTrack[];
  }, []);

  const handleTrackPress = (track: MusicTrack) => {
    if (track.locked) return;

    if (selectedTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedTrack(track);
      setIsPlaying(true);
    }
  };

  const renderTrack = (track: MusicTrack) => {
    const isSelected = selectedTrack?.id === track.id;
    const showPlayIcon = isSelected && isPlaying;

    return (
      <TouchableOpacity
        key={track.id}
        style={styles.trackContainer}
        onPress={() => handleTrackPress(track)}
        activeOpacity={0.7}
        disabled={track.locked}
      >
        <View style={styles.circleWrapper}>
          {/* Outer gray border */}
          <View style={styles.outerBorder}>
            {/* Inner white border */}
            <View style={styles.innerBorder}>
              <View
                style={[
                  styles.trackCircle,
                  { backgroundColor: track.backgroundColor },
                  isSelected && styles.selectedBorder,
                ]}
              >
                {track.locked ? (
                  <Ionicons name="lock-closed" size={28} color="white" />
                ) : showPlayIcon ? (
                  <Ionicons name="musical-notes" size={32} color="white" />
                ) : null}
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.trackName} numberOfLines={1}>
          {track.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>{musicTracks.map(renderTrack)}</View>
      </ScrollView>

      {selectedTrack && (
        <View style={styles.playerBar}>
          <View style={styles.playerInfo}>
            <View
              style={[
                styles.miniCircle,
                { backgroundColor: selectedTrack.backgroundColor },
              ]}
            >
              <Ionicons
                name={isPlaying ? "musical-notes" : "pause"}
                size={16}
                color="white"
              />
            </View>
            <View style={styles.playerText}>
              <Text style={styles.playerTitle}>{selectedTrack.name}</Text>
              <Text style={styles.playerStatus}>
                {isPlaying ? "Now Playing" : "Paused"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    justifyContent: "space-between",
  },
  trackContainer: {
    width: ITEM_SIZE,
    alignItems: "center",
    marginBottom: 30,
  },
  circleWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  outerBorder: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  innerBorder: {
    width: ITEM_SIZE - 6,
    height: ITEM_SIZE - 6,
    borderRadius: (ITEM_SIZE - 6) / 2,
    borderWidth: 1.5,
    borderColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  trackCircle: {
    width: ITEM_SIZE - 10,
    height: ITEM_SIZE - 10,
    borderRadius: (ITEM_SIZE - 10) / 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  selectedBorder: {
    borderWidth: 3,
    borderColor: "#10b981",
  },
  trackName: {
    marginTop: 10,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    width: ITEM_SIZE,
  },
  playerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  miniCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  playerText: {
    flex: 1,
  },
  playerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  playerStatus: {
    fontSize: 12,
    color: "#666",
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
});
