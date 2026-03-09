import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import type { Listing } from "@/lib/types";

interface Props {
  listing: Listing;
  onPress: () => void;
  showDistance?: boolean;
}

export function ListingCard({ listing, onPress, showDistance }: Props) {
  const firstPhoto = listing.isClaimed && listing.photos?.[0];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {firstPhoto ? (
        <Image source={{ uri: firstPhoto }} style={styles.photo} resizeMode="cover" />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.placeholderIcon}>🖋</Text>
          {!listing.isClaimed && (
            <Text style={styles.unclaimedLabel}>Unclaimed</Text>
          )}
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {listing.name}
          </Text>
          {listing.isClaimed && (
            <View style={styles.claimedBadge}>
              <Text style={styles.claimedText}>✓ Claimed</Text>
            </View>
          )}
        </View>

        <Text style={styles.location} numberOfLines={1}>
          {listing.city}, {listing.state}
          {showDistance && listing.distanceMiles != null
            ? ` · ${listing.distanceMiles} mi`
            : ""}
        </Text>

        {listing.categories.length > 0 && (
          <Text style={styles.categories} numberOfLines={1}>
            {listing.categories.map((c) => c.name).join(" · ")}
          </Text>
        )}

        <View style={styles.footer}>
          {listing.googleRating != null && (
            <Text style={styles.rating}>
              ★ {listing.googleRating.toFixed(1)}
              {listing.googleReviewCount != null
                ? ` (${listing.googleReviewCount})`
                : ""}
            </Text>
          )}
          {listing.acceptsWalkIns && (
            <View style={styles.walkInBadge}>
              <Text style={styles.walkInText}>Walk-ins</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  photo: {
    width: "100%",
    height: 180,
  },
  photoPlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  unclaimedLabel: {
    color: "#666",
    fontSize: 12,
  },
  info: {
    padding: 14,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  claimedBadge: {
    backgroundColor: "#1a3a2a",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  claimedText: {
    color: "#4ade80",
    fontSize: 11,
    fontWeight: "500",
  },
  location: {
    color: "#888",
    fontSize: 13,
  },
  categories: {
    color: "#666",
    fontSize: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  rating: {
    color: "#f59e0b",
    fontSize: 13,
    fontWeight: "500",
  },
  walkInBadge: {
    backgroundColor: "#1e2a3a",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  walkInText: {
    color: "#60a5fa",
    fontSize: 11,
  },
});
