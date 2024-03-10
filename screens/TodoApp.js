import * as React from "react";
import { useEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import Constants from "expo-constants";
import Spacer from "../components/Spacer";
import ButtonIcon from "../components/ButtonIcon";
import Task from "../components/Task";
import { Title, Card, Button, TextInput } from "react-native-paper";
import { connect } from "react-redux";
import { addTodo, deleteTodo, editTodo } from "../redux/actions";
import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../firebase/firestoreFunctions";

const TodoApp = ({ todo_list, addTodo, editTodo, deleteTodo }) => {
  const [task, setTask] = React.useState("");
  const [editSelected, setEditSelected] = React.useState(false);
  const [indexEdit, setIndexEdit] = React.useState(null);

  useEffect(() => {
    // Fetch data from Firebase only if todo_list is empty
    if (todo_list.length === 0) {
      const fetchData = async () => {
        try {
          const data = await getData();
          data.forEach(({ id, task, status }) => addTodo(id, task));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, []); // Empty dependency array ensures that this effect runs only once when the component mounts

  const handleAddTodo = async () => {
    try {
      const id = await addData(task, "due");
      addTodo(id, task);
      setTask("");
    } catch (error) {
      console.error("Error adding todo: ", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteData(id); // Delete task from Firestore
      deleteTodo(id); // Remove task from Redux state
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  const handleEditTodo = async () => {
    try {
      await updateData(
        todo_list[indexEdit].id,
        task,
        todo_list[indexEdit].status
      );
      editTodo(todo_list[indexEdit].id, task);
      setTask("");
      setEditSelected(false);
    } catch (error) {
      console.error("Error editing todo: ", error);
    }
  };

  const editClicked = (id) => {
    setEditSelected(true);
    let index = todo_list.findIndex((todo) => todo.id === id);
    setIndexEdit(index);
    setTask(todo_list[index].task);
  };

  return (
    <View style={styles.container}>
      <Card title="Card Title">
        <Text style={styles.paragraph}>
          ToDo App with React Native and Redux
        </Text>
      </Card>
      <Spacer />
      <Card>
        <Card.Content>
          <Title>{editSelected ? "Edit ToDo Here" : "Add ToDo Here"}</Title>
          <TextInput
            mode="outlined"
            label="Task"
            value={task}
            onChangeText={(task) => setTask(task)}
          />
          <Spacer />
          <Button
            mode="contained"
            onPress={editSelected ? handleEditTodo : handleAddTodo}
            disabled={!task.length > 0}
          >
            {editSelected ? "Edit Task" : "Add Task"}
          </Button>
        </Card.Content>
      </Card>
      <Spacer />
      <FlatList
        data={todo_list}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Task
            key={index}
            task={item}
            onTaskRemoval={handleDeleteTodo}
            onTaskEdit={editClicked}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const mapStateToProps = (state) => ({
  todo_list: state.todos.todo_list,
});

const mapDispatchToProps = { addTodo, editTodo, deleteTodo };

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
