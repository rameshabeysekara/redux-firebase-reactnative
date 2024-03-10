import * as React from "react";
import { useEffect, useState } from "react"; // Import useState
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native"; // Import ActivityIndicator
import Constants from "expo-constants";
import Spacer from "../components/Spacer";
import ButtonIcon from "../components/ButtonIcon";
import Task from "../components/Task";
import { Title, Card, Button, TextInput } from "react-native-paper";
import { connect } from "react-redux";
import { addTodo, deleteTodo, editTodo, resetTodoList } from "../redux/actions"; // Import resetTodoList action
import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../firebase/firestoreFunctions";

const TodoApp = ({
  todo_list,
  addTodo,
  editTodo,
  deleteTodo,
  resetTodoList,
}) => {
  // Include resetTodoList in props
  const [task, setTask] = React.useState("");
  const [editSelected, setEditSelected] = React.useState(false);
  const [indexEdit, setIndexEdit] = React.useState(null);
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Clear the Redux store before fetching data from Firebase
      await clearReduxStore();
      const data = await getData();
      data.forEach(({ id, task, status }) => addTodo(id, task, status));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearReduxStore = () => {
    // Dispatch an action to reset the todo_list in the Redux store
    return new Promise((resolve, reject) => {
      try {
        resetTodoList(); // Dispatch action to clear the Redux store
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleAddTodo = async () => {
    try {
      const id = await addData(task, "due");
      addTodo(id, task, "due");
      setTask("");
      fetchData();
    } catch (error) {
      console.error("Error adding todo: ", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteData(id);
      deleteTodo(id);
      fetchData();
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
      fetchData();
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
      {loading ? ( // Display loader if loading is true
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={todo_list}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Task
              key={index}
              task={item}
              onTaskRemoval={handleDeleteTodo}
              onTaskEdit={editClicked}
              fetchData={fetchData}
            />
          )}
        />
      )}
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

const mapDispatchToProps = { addTodo, editTodo, deleteTodo, resetTodoList }; // Include resetTodoList in mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
