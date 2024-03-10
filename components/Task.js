import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  Title,
  Paragraph,
  Card,
  Button,
  TextInput,
  RadioButton,
  Modal,
  Portal,
  PaperProvider,
} from "react-native-paper";
import ButtonIcon from "./ButtonIcon";
import Spacer from "./Spacer";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { editStatus } from "../redux/actions";
import { connect } from "react-redux";
import { updateData } from "../firebase/firestoreFunctions";

const Task = (props) => {
  const [value, setValue] = React.useState(props.task.status);
  const [borderColor, setBorderColor] = React.useState("gray");

  React.useEffect(() => {
    switch (value) {
      case "due":
        setBorderColor("blue");
        break;
      case "done":
        setBorderColor("green");
        break;
      case "late":
        setBorderColor("red");
        break;
      default:
        setBorderColor("gray");
        break;
    }
  }, [value]);

  const handleEditStatus = async (status) => {
    setValue(status);
    props.editStatus(props.task.id, status); // Update status in Redux state
    try {
      await updateData(props.task.id, props.task.task, status); // Update status in Firestore
    } catch (error) {
      console.error("Error updating status in Firestore: ", error);
    }
  };

  return (
    <>
      <Card
        style={{ borderColor: borderColor, borderWidth: 2, borderRadius: 10 }}
      >
        <Card.Title
          title={`Id: ${props.task.id}`}
          left={() => <Icon name="tasks" size={24} color="black" />}
          right={() => (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <ButtonIcon
                iconName="edit"
                onPress={() => props.onTaskEdit(props.task.id)}
              />
              <ButtonIcon
                iconName="close"
                color="red"
                onPress={() => props.onTaskRemoval(props.task.id)}
              />
            </View>
          )}
        />
        <Card.Content>
          <Paragraph>{props.task.task}</Paragraph>
          <RadioButton.Group
            onValueChange={(newValue) => handleEditStatus(newValue)}
            value={value}
          >
            <View style={styles.radioButtons}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text>Due</Text>
                <RadioButton value="due" />
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text>Done</Text>
                <RadioButton value="done" />
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text>Late</Text>
                <RadioButton value="late" />
              </View>
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>
      <Spacer />
    </>
  );
};

const styles = StyleSheet.create({
  radioButtons: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
  },
});

export default connect(null, { editStatus })(Task);
