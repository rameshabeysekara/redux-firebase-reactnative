import * as React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import Constants from 'expo-constants';
import Spacer from '../components/Spacer';
import ButtonIcon from '../components/ButtonIcon';
import Task from '../components/Task';
import { Title, Paragraph, Card, Button, TextInput, RadioButton } from 'react-native-paper';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { addTodo, deleteTodo, editTodo } from '../redux/actions';

const TodoApp = ({ todo_list, addTodo, editTodo, deleteTodo }) => {
  const [task, setTask] = React.useState('');
  const [editSelected, setEditSelected] = React.useState(false);
  const [indexEdit, setIndexEdit] = React.useState(null);

  const handleAddTodo = () => {
    addTodo(task)
    setTask('')
  }

  const handleDeleteTodo = (id) => {
    deleteTodo(id)
  }

  const handleEditTodo = () => {
    editTodo(todo_list[indexEdit].id, task)
    setTask('')
    setEditSelected(false)
  }

  const handleStatusChange = () => {
    console.log("njdscn")
  }

  const editClicked = (id) => {
    setEditSelected(true)
    let index = todo_list.findIndex(todo => todo.id === id)
    setIndexEdit(index)
    setTask(todo_list[index].task)
  }

  return (
    <View style={styles.container}>
      <Card title="Card Title">
        <Text style={styles.paragraph}>ToDo App with React Native and Redux</Text>
      </Card>
      <Spacer />
      <Card>
        <Card.Content>
          <Title>{editSelected? 'Edit ToDo Here' : 'Add ToDo Here' }</Title>
          <TextInput
            mode="outlined"
            label="Task"
            value={task}
            onChangeText={task => setTask(task)}
          />
          <Spacer/>
          <Button mode="contained" onPress={editSelected? handleEditTodo : handleAddTodo} disabled={!task.length>0}>
            {editSelected? 'Edit Task' : 'Add Task'}
          </Button>
        </Card.Content>
      </Card>
      <Spacer />
      <FlatList
        data={todo_list}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => {
          return (
            <>
              <Task key={index} task={item} onStatusChange={handleStatusChange} onTaskRemoval={handleDeleteTodo}      onTaskEdit={editClicked}/>
            </>
          );
        }}
      />
      <Spacer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    todo_list: state.todos.todo_list,
  }
}

const mapDispatchToProps = { addTodo, editTodo, deleteTodo }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp)
