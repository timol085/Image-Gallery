import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";

interface ImageData {
  id: number;
  title: string;
  imageUrl: ImageSourcePropType;
}

interface CarouselProps {
  data: ImageData[];
  view: "single" | "multi";
  border: boolean;
}

const Carousel = ({ data, view, border }: CarouselProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { width } = Dimensions.get("window");
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const listener = scrollX.addListener(({ value }) =>
      setCurrentPage(Math.round(value / width))
    );
    return () => scrollX.removeListener(listener);
  }, [scrollX, view]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );
  const scrollToPage = (page: number) =>
    scrollViewRef.current?.scrollTo({ x: page * width, animated: true });

  // Function to render images based on the view type, single or multi
  const renderImages = () =>
    view === "multi"
      ? renderMultiView(data, border)
      : renderSingleView(data, border);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={200}
      >
        {renderImages()}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {renderDots(data, view, currentPage, scrollToPage)}
      </View>
    </View>
  );
};

// single view, 1 image per page
const renderSingleView = (data: ImageData[], border: boolean) => {
  return data.map((item, index) => (
    <View key={index} style={styles.page}>
      <View style={[styles.imageContainer, border ? styles.border : null]}>
        <Image source={item.imageUrl} style={styles.image} />
      </View>
    </View>
  ));
};

// multi view, 4 images per page
const renderMultiView = (data: ImageData[], border: boolean) => {
  // Each page in the 'multi' view shows 4 images (2 rows of 2 images each).
  return Array.from({ length: Math.ceil(data.length / 4) }).map(
    (_, pageIndex) => (
      // Creating two rows per page. Each row will contain 2 images. Together a 2x2 grid.
      // In each row, map over two columns to place two images.
      <View key={pageIndex} style={styles.page}>
        {Array.from({ length: 2 }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.multiImageRow}>
            {Array.from({ length: 2 }).map((_, columnIndex) => {
              // Calculating the index of the current item based on page, row, and column.
              const itemIndex = pageIndex * 4 + rowIndex * 2 + columnIndex;
              const item = data[itemIndex];
              return item ? (
                <View
                  key={itemIndex}
                  style={[styles.imageContainer, border ? styles.border : null]}
                >
                  {item.imageUrl ? (
                    <Image source={item.imageUrl} style={styles.multiImage} />
                  ) : (
                    <Text>No Image</Text>
                  )}
                </View>
              ) : null;
            })}
          </View>
        ))}
      </View>
    )
  );
};

// Creating the navigation dots
const renderDots = (
  data: ImageData[],
  view: "single" | "multi",
  currentPage: number,
  scrollToPage: (page: number) => void
) => {
  const numberOfDots =
    view === "multi" ? Math.ceil(data.length / 4) : data.length;
  const maxVisibleDots = Math.min(5, numberOfDots);

  let startDot = Math.max(0, currentPage - Math.floor(maxVisibleDots / 2));
  if (currentPage >= numberOfDots - Math.floor(maxVisibleDots / 2)) {
    startDot = Math.max(0, numberOfDots - maxVisibleDots);
  }

  // Rendering the dots using Array.map. One dot for each page
  return Array.from({ length: maxVisibleDots }).map((_, index) => {
    const dotIndex = startDot + index;
    const isActive = dotIndex === currentPage;

    return (
      <TouchableOpacity
        key={dotIndex}
        style={[
          styles.dot,
          isActive && styles.activeDot,
          { width: 8, height: 8, opacity: isActive ? 1 : 0.5 },
        ]}
        onPress={() => scrollToPage(dotIndex)}
      />
    );
  });
};

// Styles for the Carousel component
const styles = StyleSheet.create({
  container: {
    height: 550,
    marginTop: 20,
    paddingTop: 20,
  },
  page: {
    width: Dimensions.get("window").width,
    alignItems: "center",
  },
  image: {
    width: 320,
    height: 450,
    borderRadius: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 20,
    marginHorizontal: 140,
    padding: 10,
    backgroundColor: "#353839",
    opacity: 0.8,
    borderRadius: 10,
  },
  dot: {
    borderRadius: 4,
    backgroundColor: "#e8e8e8",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#fff",
  },
  multiImage: {
    width: 160,
    height: 220,
  },
  multiImageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    margin: 3,
    borderRadius: 10,
    overflow: "hidden",
  },
  border: {
    borderWidth: 1,
    borderColor: "#c3c3c3",
  },
});

export default Carousel;
