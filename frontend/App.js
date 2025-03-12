import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import * as DocumentPicker from "expo-document-picker";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SEARCH_ENDPOINT = "<your-api-endpoint>";

const CATEGORIES = [
  "Marketing",
  "Engineering",
  "Software Development",
  "AI & Machine Learning",
  "Finance",
  "Biotech & Healthcare",
  "Education",
  "IT & Cloud Computing",
  "Cybersecurity",
  "Construction & Infrastructure",
  "Research & Science",
  "Supply Chain & Logistics",
  "Sales & Business Development",
  "Legal & Compliance",
  "Retail & Customer Service",
  "Human Resources & Recruitment",
  "Creative & Design",
  "Energy & Sustainability",
  "Medical & Healthcare Services",
  "Aerospace & Defense"
]

const formatSalaryAmount = (amount) => {
  if (amount < 1000) {
    return amount;
  }

  return (amount / 1000).toFixed(1) + "k";
};

const triggerHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export default function App() {
  let [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
  });

  const [jobs, setJobs] = useState([]);

  const [resume, setResume] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const isDoneButtonEnabled = resume != null;
  const [isLoading, setIsLoading] = useState(false);

  const insets = useSafeAreaInsets();

  if (!fontsLoaded) {
    return null;
  }

  const onSearchPress = async () => {
    triggerHaptic();
    setIsLoading(true);

    const base64File = await FileSystem.readAsStringAsync(resume.uri, { encoding: FileSystem.EncodingType.Base64 });


    try {
      const response = await fetch(SEARCH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: JSON.stringify({
          file: base64File,
          categories: selectedCategories,
        }),
      });

      setIsLoading(false);

      const result = await response.json();

      console.log(result);
      const jobs = result.response.map((job) => {
        return {
          score: job.score,
          ...JSON.parse(
            job.text
              .replace(/'/g, '"')  // Replace all single quotes with double quotes
              .replace(/\b(True|False)\b/g, (match) => match.toLowerCase())  // Convert Python boolean values to JSON format
          )
        };
      });

      setJobs(jobs);

    } catch (error) {
      setIsLoading(false);
      console.log("Error searching for jobs", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View
        style={{
          flex: 1,
          width: "100%",
          paddingTop: insets.top,
        }}
      >
        <FlatList
          contentContainerStyle={{
            gap: 12,
            paddingBottom: 32,
          }}
          ListHeaderComponent={
            <View
              style={{
                padding: 16,
              }}
            >
              <Image
                style={{ resizeMode: "contain", width: 120, height: 30 }}
                source={require("./assets/dynamo-logo.png")}
              />

              <View style={{ marginTop: 12 }}>
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Manrope_700Bold",
                    fontSize: 36,
                  }}
                >
                  Welcome to Scout
                </Text>
              </View>

              <View style={{ flex: 1, marginTop: 16 }}>
                <Text
                  style={{
                    color: "#ddd",
                    fontFamily: "Manrope_700Bold",
                    marginBottom: 16,
                    fontSize: 14,
                  }}
                >
                  1. Upload you CV
                </Text>

                {/* Upload CV button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#202020",
                    paddingVertical: 16,
                    alignItems: "center",
                    borderRadius: 32,
                  }}
                  onPress={() => {
                    DocumentPicker.getDocumentAsync().then(({ assets }) => {
                      const { uri, name, mimeType } = assets[0];
                      if (mimeType == "application/pdf") {
                        setResume({ uri, name, mimeType });
                        setJobs([]);
                      }
                    });

                  }}
                >
                  <Image
                    style={{ height: 24, width: 24 }}
                    source={require("./assets/resume.png")}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Manrope_700Bold",
                      textTransform: "uppercase",
                      fontSize: 16,
                      letterSpacing: 0.65,
                      fontSize: 15,
                    }}
                  >
                    Upload your CV
                  </Text>
                </TouchableOpacity>

                {resume != null && (
                  <View style={{ alignItems: "center", marginTop: 12 }}>
                    <Text
                      style={{
                        color: "#fff",
                        fontFamily: "Manrope_400Regular",
                      }}
                    >
                      Your Resume: {resume.name}
                    </Text>
                  </View>
                )}

                {/* Choose xategories */}

                <View style={{ marginTop: 16 }}>
                  <Text
                    style={{
                      color: "#ddd",
                      fontFamily: "Manrope_700Bold",
                      marginBottom: 16,
                    }}
                  >
                    2. Choose the jobs you prefer
                  </Text>

                  <ScrollView
                    horizontal
                    contentContainerStyle={{ gap: 12 }}
                    showsHorizontalScrollIndicator={false}
                  >
                    {CATEGORIES.map(
                      (category) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              let newCategories = [...selectedCategories];

                              if (selectedCategories.includes(category)) {
                                newCategories = newCategories.filter(
                                  (c) => c != category
                                );
                                setSelectedCategories(newCategories);
                              } else {
                                triggerHaptic();

                                newCategories.push(category);
                                setSelectedCategories(newCategories);
                              }
                            }}
                            activeOpacity={0.8}
                            style={{
                              paddingHorizontal: 24,
                              paddingVertical: 14,
                              borderRadius: 32,
                              backgroundColor: selectedCategories.includes(
                                category
                              )
                                ? "#3c4cc7"
                                : "#202020",
                            }}
                            key={category}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                letterSpacing: 0.65,
                                fontFamily: "Manrope_700Bold",
                                textTransform: "uppercase",
                                fontSize: 15,
                              }}
                            >
                              {category}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </ScrollView>
                </View>
              </View>
            </View>
          }
          data={jobs}
          ListEmptyComponent={
            isLoading ? <View style={{ alignItems: "center", gap: 8, marginTop: 32 }}>
              <ActivityIndicator />
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Manrope_500Medium",
                  fontSize: 16,
                }}
              >
                Looking for your next job
              </Text>
            </View> : null
          }
          keyExtractor={(item) => item.title + item.url}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(item.url);
                }}
                style={styles.cell}
                activeOpacity={0.8}
              >
                <View style={{ alignItems: "flex-end" }}>
                  <View
                    style={{
                      backgroundColor: "#3c4cc7",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 32,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        textTransform: "uppercase",
                        fontFamily: "Manrope_700Bold",
                        letterSpacing: 0.65,
                        fontSize: 12,
                      }}
                    >
                      {item.job_type}
                    </Text>
                  </View>
                </View>

                <Image
                  source={{
                    uri: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.url}&size=128`,
                  }}
                  style={{ width: 30, height: 30, borderRadius: 8 }}
                />
                <View style={{ gap: 12 }}>
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Manrope_700Bold",
                      fontSize: 22,
                    }}
                  >
                    {item.title}
                  </Text>
                  {item.description && <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Manrope_400Regular",
                      fontSize: 15,
                    }}
                  >
                    {item.description}
                  </Text>}
                </View>

                <View style={{ gap: 12, marginTop: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      style={{ width: 24, height: 24 }}
                      source={require("./assets/dollars.png")}
                    />
                    <Text
                      style={{
                        color: "#fff",
                        fontFamily: "Manrope_700Bold",
                        fontSize: 15,
                      }}
                    >
                      Salary: {formatSalaryAmount(item.min_amount)} - {formatSalaryAmount(item.max_amount)} {item.currency}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Image
                      style={{ width: 24, height: 24 }}
                      source={require("./assets/map-marker.png")}
                    />
                    <Text
                      style={{
                        color: "#fff",
                        fontFamily: "Manrope_700Bold",
                        fontSize: 15,
                      }}
                    >
                      {item.location}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 16, gap: 8 }}>
                  <Text style={{ color: "#fff", fontFamily: "Manrope_500Medium", fontSize: 16, marginBottom: 4 }}>Match Score: {item.score * 100}%</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          width: "100%",
          paddingBottom: insets.bottom,
          backgroundColor: "#202020",
        }}
      >
        <View style={{ paddingTop: 16, paddingBottom: 8 }}>
          <TouchableOpacity
            onPress={onSearchPress}
            disabled={!isDoneButtonEnabled}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              gap: 16,
              justifyContent: "center",
              backgroundColor: "#0220fc",
              paddingVertical: 16,
              alignItems: "center",
              borderRadius: 32,
              opacity: isDoneButtonEnabled ? 1 : 0.5,
            }}
          >
            {/* <ActivityIndicator color={"#fff"} /> */}

            {isLoading ? <ActivityIndicator color={"#fff"} /> : <Text
              style={{
                color: "#fff",
                fontFamily: "Manrope_700Bold",
                textTransform: "uppercase",
                fontSize: 16,
                letterSpacing: 0.65,
                fontSize: 15,
              }}
            >
              start searching
            </Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  cell: {
    backgroundColor: "#202020",
    borderRadius: 32,
    marginHorizontal: 16,
    padding: 24,
    gap: 12,
  },
});
