import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { getListings } from "@/lib/api";
import { ListingCard } from "@/components/ListingCard";
import { SearchBar } from "@/components/SearchBar";
import type { Listing } from "@/lib/types";

const STYLES = [
  "Traditional", "Neo-Traditional", "Realism", "Blackwork",
  "Japanese", "Watercolor", "Geometric", "Tribal", "Fine Line",
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [walkInsOnly, setWalkInsOnly] = useState(false);
  const [claimedOnly, setClaimedOnly] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (p = 1) => {
    setLoading(true);
    setSearched(true);
    try {
      const data = await getListings({
        q: query || undefined,
        style: selectedStyle?.toLowerCase().replace(/\s+/g, "-") || undefined,
        walkIns: walkInsOnly,
        claimedOnly,
        page: p,
      });
      if (p === 1) {
        setListings(data.listings);
      } else {
        setListings((prev) => [...prev, ...data.listings]);
      }
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [query, selectedStyle, walkInsOnly, claimedOnly]);

  const loadMore = () => {
    if (!loading && page < totalPages) {
      doSearch(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={() => doSearch(1)}
          placeholder="City, state, or shop name..."
        />

        <View style={styles.styleRow}>
          <FlatList
            horizontal
            data={STYLES}
            keyExtractor={(s) => s}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.styleChip,
                  selectedStyle === item && styles.styleChipActive,
                ]}
                onPress={() => setSelectedStyle(selectedStyle === item ? null : item)}
              >
                <Text
                  style={[
                    styles.styleChipText,
                    selectedStyle === item && styles.styleChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggle}>
            <Text style={styles.toggleLabel}>Walk-ins only</Text>
            <Switch
              value={walkInsOnly}
              onValueChange={setWalkInsOnly}
              trackColor={{ false: "#2a2a2a", true: "#7c3aed" }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggle}>
            <Text style={styles.toggleLabel}>Claimed listings only</Text>
            <Switch
              value={claimedOnly}
              onValueChange={setClaimedOnly}
              trackColor={{ false: "#2a2a2a", true: "#7c3aed" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={() => doSearch(1)}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && page === 1 ? (
        <View style={styles.center}>
          <ActivityIndicator color="#a855f7" size="large" />
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={() => router.push(`/listing/${item.slug}`)}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loading && page > 1 ? (
              <ActivityIndicator color="#a855f7" style={{ paddingVertical: 20 }} />
            ) : null
          }
          ListEmptyComponent={
            searched ? (
              <View style={styles.center}>
                <Text style={styles.emptyText}>No shops found.</Text>
                <Text style={styles.emptyHint}>Try broadening your search.</Text>
              </View>
            ) : (
              <View style={styles.center}>
                <Text style={styles.emptyText}>Search to find shops.</Text>
              </View>
            )
          }
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  filters: {
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  styleRow: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  styleChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  styleChipActive: {
    backgroundColor: "#3b0764",
    borderColor: "#7c3aed",
  },
  styleChipText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "500",
  },
  styleChipTextActive: {
    color: "#d8b4fe",
  },
  toggleRow: {
    gap: 8,
  },
  toggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLabel: {
    color: "#aaa",
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    color: "#555",
    fontSize: 16,
  },
  emptyHint: {
    color: "#444",
    fontSize: 13,
    marginTop: 6,
  },
});
