import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {TODO_COLLECTION_NAME} from '../../store/InitializedDB';
import styles from './styles';
import {db} from '../../store/InitializedDB';
import {TodoDocType} from '../../schemas/TodoSchema';

const TodoList = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todoList, setTodoList] = useState<TodoDocType[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<TodoDocType | null>(null);

  const deleteIcon =
    'https://img.icons8.com/external-creatype-outline-colourcreatype/512/external-app-web-application-2-creatype-outline-colourcreatype-20.png';
  const pencilIcon = 'https://img.icons8.com/ios-glyphs/512/pencil.png';

  useEffect(() => {
    const fetchTodos = async () => {
      if (db[TODO_COLLECTION_NAME]) {
        await db[TODO_COLLECTION_NAME].find().$.subscribe((todo: any) => {
          if (!todo) {
            return;
          }
          setTodoList(todo);
        });
      } else {
        return;
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (db[TODO_COLLECTION_NAME]) {
      const todos = {
        id: `${Date.now()}`,
        title,
        description,
        done: false,
      };
      await db[TODO_COLLECTION_NAME].insert(todos);
      setTodoList([...todoList, todos]);
      setTitle('');
      setDescription('');
    }
  };

  const updateTodo = async () => {
    const todo = {
      id: selectedTodo?.id,
      title,
      description,
      done: false,
    };
    await db[TODO_COLLECTION_NAME].upsert(todo);
    setSelectedTodo(null);
    setTitle('');
    setDescription('');
  };

  const selectTodo = (todo: TodoDocType) => {
    setSelectedTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const removeTodo = async (todo: any) => {
    console.log(todo);
    Alert.alert(
      'Delete Todo?',
      `Are you sure you want to delete '${todo.title}'`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          style: 'destructive',
          onPress: async () => {
            const query = db[TODO_COLLECTION_NAME].findOne({
              selector: {
                id: todo.id,
              },
            });
            await query.remove();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.topContainer}>
      <Text style={styles.todoStyle}>{'TODO LIST'}</Text>
      <ScrollView style={styles.todoList}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={name => setTitle(name)}
            placeholder="Title"
          />
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={des => setDescription(des)}
            placeholder="Description"
          />
          <TouchableOpacity
            style={styles.plusImage}
            disabled={!title}
            onPress={() => {
              !selectedTodo ? addTodo() : updateTodo();
            }}>
            <Text style={styles.buttonText}>
              {!selectedTodo ? 'Add Todo' : 'Update Todo'}
            </Text>
          </TouchableOpacity>
        </View>
        {todoList.length === 0 && (
          <>
            <Text style={styles.noTodoStyle}>{'No Todo Items'}</Text>
            <Text style={styles.noTodoStyle}>{'Add one to create'}</Text>
          </>
        )}
        {todoList?.map((item: TodoDocType, index: number) => (
          <View style={styles.cardTodo} key={index}>
            <View>
              <Text style={styles.todoName}>{item.title}</Text>
              <Text style={styles.descStyle}>{item.description}</Text>
            </View>
            <View style={styles.alignRight}>
              <TouchableOpacity onPress={() => selectTodo(item)}>
                <Image
                  style={styles.deleteImage}
                  source={{
                    uri: pencilIcon,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeTodo(item)}>
                <Image
                  style={styles.deleteImage}
                  source={{
                    uri: deleteIcon,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TodoList;
