import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/AuthContext";
import { getMyListings } from "@/lib/api";
import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/lib/types";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, token, signOut, isLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  useEffect(() => {
    if (user && token) {
      setLoadingListings(true);
      getMyListings(token)
        .then((data) => setListings(data.listings))
        .catch(() => {})
        .finally(() => setLoadingListings(false));
    }
  }, [user, token]);

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#a855f7" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.subtitle}>
          Sign in to manage your shop listings, upload photos, and more.
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.primaryBtnText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.secondaryBtnText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <Text style={styles.claimHeading}>Own a tattoo shop?</Text>
        <Text style={styles.claimBody}>
          Claim your listing to add photos, update your info, and reach more clients.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={listings}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <ListingCard
          listing={item}
          onPress={() => router.push(`/listing/${item.slug}`)}
        />
      )}
      ListHeaderComponent={
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.plan === "premium" && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>⭐ Premium</Text>
            </View>
          )}

          <View style={styles.actions}>
            {listings.length === 0 && !loadingListings && (
              <Text style={styles.noListings}>
                You haven't claimed any listings yet.{"\n"}
                Search for your shop and claim it.
              </Text>
            )}
          </View>

          {listings.length > 0 && (
            <Text style={styles.sectionLabel}>Your Claimed Listings</Text>
          )}

          {loadingListings && (
            <ActivityIndicator color="#a855f7" style={{ marginTop: 20 }} />
          )}
        </View>
      }
      ListFooterComponent={
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      }
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: "#0f0f0f",
  },
  center: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#888",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  primaryBtn: {
    backgroundColor: "#7c3aed",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#aaa",
    fontWeight: "600",
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#1a1a1a",
    width: "100%",
    marginVertical: 12,
  },
  claimHeading: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  claimBody: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    gap: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#3b0764",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    color: "#d8b4fe",
    fontSize: 28,
    fontWeight: "700",
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  email: {
    color: "#666",
    fontSize: 14,
  },
  premiumBadge: {
    backgroundColor: "#1a1a00",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  premiumText: {
    color: "#fbbf24",
    fontSize: 13,
    fontWeight: "600",
  },
  actions: {
    marginTop: 16,
    width: "100%",
    gap: 10,
  },
  noListings: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  sectionLabel: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  signOutBtn: {
    margin: 24,
    borderWidth: 1,
    borderColor: "#3a1a1a",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  signOutText: {
    color: "#f87171",
    fontWeight: "600",
    fontSize: 15,
  },
});
