import { Text, View, StyleSheet } from "react-native";
import {
  Button,
  TextInput,
  Card,
  Avatar,
  Appbar,
  Paragraph,
} from "react-native-paper";
import { useState } from "react";
import { Image, Dimensions } from "react-native";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { ScreenContentWrapper } from "react-native-screens";

export default function Index() {
  const baseUrl = "http://192.168.1.3:8080";
  const getPersonFromApi = async (email: string) => {
    const url = `${baseUrl}/persons/email/${email}`;
    console.log(url);
    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        return json;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [person, setPerson] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const handleButtonPress = async () => {
    const personData = await getPersonFromApi(email.toLowerCase());
    if (personData) {
      setPerson(personData);
      if (personData.mongoDbObjectId?.length) {
        const imageUrl = `${baseUrl}/persons/file/${personData.mongoDbObjectId[0]}`;
        console.log(imageUrl);
        setImageUrl(imageUrl);
        Image.getSize(imageUrl, (width, height) => {
          const screenWidth = Dimensions.get("window").width;
          const scaleFactor = width / screenWidth;
          const imageHeight = height / scaleFactor;
          setImageDimensions({ width: screenWidth, height: imageHeight });
        });
      }

      const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 16,
        },
        content: {
          alignItems: "center",
        },
      });
    } else {
      console.error("No person data found");
    }
  };

  const LeftContent = (props: { size: number }) => (
    <Avatar.Icon {...props} icon="folder" />
  );

  return (
    <View>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          style={[styles.container, { backgroundColor: "#FFFFFF" }]} // Replace with your desired color
          contentContainerStyle={styles.content}
        >
          <Card>
            <Card.Title
              title="Card Title"
              subtitle="Card Subtitle"
              left={LeftContent}
            />
            <Card.Content>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                Card title
              </Text>
              <Text>
                {person && <Text>{JSON.stringify(person, null, 2)}</Text>}
              </Text>
            </Card.Content>
            {imageUrl && <Card.Cover source={{ uri: imageUrl }} />}
            <Card.Actions>
              <Button>Cancel</Button>
              <Button>Ok</Button>
            </Card.Actions>
          </Card>

          <Text>Edit app/index.tsx to edit this screen.</Text>
          <TextInput
            mode="outlined"
            label="Person email"
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            right={<TextInput.Icon icon="email" />}
          />
          <Button onPress={handleButtonPress}>Press me</Button>
          <View>
            {imageUrl && imageDimensions && (
              <Image
                source={{ uri: imageUrl }}
                //style={{ width: imageDimensions.width, height: imageDimensions.height }}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
            )}
          </View>
          <View>
            {person && <Text>{JSON.stringify(person, null, 2)}</Text>}
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 4,
  },
  card: {
    margin: 4,
  },
  chip: {
    margin: 4,
  },
  preference: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  button: {
    borderRadius: 12,
  },
  customCardRadius: {
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  customCoverRadius: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 24,
  },
});
