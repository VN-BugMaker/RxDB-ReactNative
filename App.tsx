import React from 'react';
import {LogBox, SafeAreaView} from 'react-native';
import styles from './src/components/TodosList/styles';
import TodoList from './src/components/TodosList/TodosList';

LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TodoList />
    </SafeAreaView>
  );
};

export default App;
