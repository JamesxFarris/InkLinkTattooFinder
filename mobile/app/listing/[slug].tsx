import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getListing } from "@/lib/api";
import type { ListingDetail } from "@/lib/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PRICE_LABELS: Record<string, string> = {
  budget: "$ Budget",
  moderate: "$$ Moderate",
  premium: "$$$ Premium",
  luxury: "$$$$ Luxury",
};

export default function ListingDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    getListing(slug)
      .then((data) => {
        setListing(data.listing);
        navigation.setOptions({ title: data.listing.name });
      })
      .catch(() => Alert.alert("Error", "Could not load shop details."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Shop not found.</Text>
      </View>
    );
  }

  const photos = listing.isClaimed && listing.photos?.length ? listing.photos : [];
  const hasPhotos = photos.length > 0;

  const openLink = (url: string | null) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  };

  const openPhone = (phone: string | null) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone.replace(/\D/g, "")}`).catch(() => {});
  };

  const openMaps = () => {
    if (!listing.address) return;
    const encoded = encodeURIComponent(listing.address);
    Linking.openURL(`https://maps.google.com/?q=${encoded}`).catch(() => {});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 48 }}>
      {/* Photo gallery — only for claimed listings */}
      {hasPhotos ? (
        <View>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={photos}
            keyExtractor={(_, i) => String(i)}
            onMomentumScrollEnd={(e) => {
              setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.photo} resizeMode="cover" />
            )}
          />
          {photos.length > 1 && (
            <View style={styles.photoDots}>
              {photos.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === photoIndex && styles.dotActive]}
                />
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noPhotoPlaceholder}>
          <Text style={styles.placeholderIcon}>🖋</Text>
          {!listing.isClaimed && (
            <>
              <Text style={styles.noPhotoTitle}>This listing hasn't been claimed yet</Text>
              <Text style={styles.noPhotoText}>
                Are you the owner? Claim this listing to add photos and manage your profile.
              </Text>
            </>
          )}
        </View>
      )}

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{listing.name}</Text>
            <Text style={styles.location}>
              {listing.city}, {listing.state}
            </Text>
          </View>
          {listing.isClaimed && (
            <View style={styles.claimedBadge}>
              <Text style={styles.claimedText}>✓ Claimed</Text>
            </View>
          )}
        </View>

        {/* Rating */}
        {listing.googleRating != null && (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingStars}>
              {"★".repeat(Math.round(listing.googleRating))}
              {"☆".repeat(5 - Math.round(listing.googleRating))}
            </Text>
            <Text style={styles.ratingText}>
              {listing.googleRating.toFixed(1)}
              {listing.googleReviewCount != null
                ? ` · ${listing.googleReviewCount} reviews`
                : ""}
            </Text>
          </View>
        )}

        {/* Categories / Styles */}
        {listing.categories.length > 0 && (
          <View style={styles.chips}>
            {listing.categories.map((c) => (
              <View key={c.slug} style={styles.chip}>
                <Text style={styles.chipText}>{c.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Quick info badges */}
        <View style={styles.badges}>
          {listing.acceptsWalkIns && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🚶 Walk-ins welcome</Text>
            </View>
          )}
          {listing.priceRange && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{PRICE_LABELS[listing.priceRange] ?? listing.priceRange}</Text>
            </View>
          )}
          {listing.minimumAge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔞 {listing.minimumAge}+ only</Text>
            </View>
          )}
          {listing.piercingServices && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>💎 Piercing</Text>
            </View>
          )}
          {listing.tattooRemoval && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔦 Removal</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {listing.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>
        )}

        {/* Pricing */}
        {(listing.hourlyRateMin != null || listing.hourlyRateMax != null) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <Text style={styles.bodyText}>
              {listing.hourlyRateMin != null && listing.hourlyRateMax != null
                ? `$${listing.hourlyRateMin}–$${listing.hourlyRateMax}/hr`
                : listing.hourlyRateMin != null
                ? `From $${listing.hourlyRateMin}/hr`
                : `Up to $${listing.hourlyRateMax}/hr`}
            </Text>
          </View>
        )}

        {/* Contact actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactButtons}>
            {listing.phone && (
              <TouchableOpacity style={styles.contactBtn} onPress={() => openPhone(listing.phone)}>
                <Text style={styles.contactBtnText}>📞 Call</Text>
              </TouchableOpacity>
            )}
            {listing.address && (
              <TouchableOpacity style={styles.contactBtn} onPress={openMaps}>
                <Text style={styles.contactBtnText}>📍 Directions</Text>
              </TouchableOpacity>
            )}
            {listing.website && (
              <TouchableOpacity style={styles.contactBtn} onPress={() => openLink(listing.website)}>
                <Text style={styles.contactBtnText}>🌐 Website</Text>
              </TouchableOpacity>
            )}
            {listing.instagramUrl && (
              <TouchableOpacity style={styles.contactBtn} onPress={() => openLink(listing.instagramUrl)}>
                <Text style={styles.contactBtnText}>📸 Instagram</Text>
              </TouchableOpacity>
            )}
          </View>
          {listing.address && (
            <Text style={styles.address}>{listing.address}</Text>
          )}
        </View>

        {/* Hours */}
        {listing.hours && Object.keys(listing.hours).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hours</Text>
            {Object.entries(listing.hours).map(([day, hours]) => (
              <View key={day} style={styles.hoursRow}>
                <Text style={styles.hoursDay}>{day}</Text>
                <Text style={styles.hoursTime}>{hours}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Artists */}
        {listing.artists && listing.artists.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Artists</Text>
            {listing.artists.map((artist, i) => (
              <View key={i} style={styles.artistRow}>
                <Text style={styles.artistName}>{artist.name}</Text>
                {artist.specialties?.length > 0 && (
                  <Text style={styles.artistSpec}>{artist.specialties.join(", ")}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Claim CTA for unclaimed */}
        {!listing.isClaimed && (
          <View style={styles.claimCTA}>
            <Text style={styles.claimCTATitle}>Is this your shop?</Text>
            <Text style={styles.claimCTABody}>
              Claim this listing to add your portfolio photos, update your info, and get
              a "Verified" badge.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f0f0f",
  },
  errorText: {
    color: "#666",
    fontSize: 16,
  },
  photo: {
    width: SCREEN_WIDTH,
    height: 260,
  },
  photoDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#333",
  },
  dotActive: {
    backgroundColor: "#a855f7",
  },
  noPhotoPlaceholder: {
    height: 160,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
  },
  placeholderIcon: {
    fontSize: 36,
  },
  noPhotoTitle: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  noPhotoText: {
    color: "#555",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  content: {
    padding: 20,
    gap: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  location: {
    color: "#777",
    fontSize: 14,
    marginTop: 2,
  },
  claimedBadge: {
    backgroundColor: "#1a3a2a",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    marginLeft: 8,
  },
  claimedText: {
    color: "#4ade80",
    fontSize: 12,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  ratingStars: {
    color: "#f59e0b",
    fontSize: 16,
  },
  ratingText: {
    color: "#aaa",
    fontSize: 14,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#1a1a2a",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  chipText: {
    color: "#a78bfa",
    fontSize: 13,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  badgeText: {
    color: "#aaa",
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    color: "#aaa",
    fontSize: 15,
    lineHeight: 22,
  },
  bodyText: {
    color: "#aaa",
    fontSize: 15,
  },
  contactButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  contactBtn: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  contactBtnText: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "500",
  },
  address: {
    color: "#666",
    fontSize: 13,
    marginTop: 4,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  hoursDay: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "500",
  },
  hoursTime: {
    color: "#777",
    fontSize: 14,
  },
  artistRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  artistName: {
    color: "#ddd",
    fontSize: 15,
    fontWeight: "600",
  },
  artistSpec: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },
  claimCTA: {
    backgroundColor: "#1a1226",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#2d1b4e",
    marginTop: 8,
    gap: 8,
  },
  claimCTATitle: {
    color: "#d8b4fe",
    fontSize: 16,
    fontWeight: "700",
  },
  claimCTABody: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 20,
  },
});
