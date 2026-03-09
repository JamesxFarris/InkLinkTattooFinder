import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { getNearbyListings, getListings } from "@/lib/api";
import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/lib/types";

export default function ExploreScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usingLocation, setUsingLocation] = useState(false);

  const fetchNearby = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        fetchFallback();
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const data = await getNearbyListings({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        radius: 50,
      });
      setListings(data.listings);
      setUsingLocation(true);
    } catch {
      fetchFallback();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchFallback = async () => {
    try {
      const data = await getListings({ page: 1 });
      setListings(data.listings);
    } catch (e) {
      Alert.alert("Error", "Could not load listings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNearby();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNearby();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#a855f7" />
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
          showDistance={usingLocation}
          onPress={() => router.push(`/listing/${item.slug}`)}
        />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>InkLink</Text>
          <Text style={styles.subtitle}>
            {usingLocation ? "Shops near you" : "Discover tattoo shops"}
          </Text>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => router.push("/(tabs)/search")}
          >
            <Text style={styles.searchBtnText}>🔍  Search by city or style</Text>
          </TouchableOpacity>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>No shops found nearby.</Text>
        </View>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#a855f7" />
      }
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: "#0f0f0f",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#888",
    fontSize: 15,
    marginTop: 2,
    marginBottom: 14,
  },
  searchBtn: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  searchBtnText: {
    color: "#555",
    fontSize: 15,
  },
  emptyText: {
    color: "#555",
    fontSize: 15,
  },
});
