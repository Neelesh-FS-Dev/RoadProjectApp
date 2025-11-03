// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import ProjectDetailsScreen from './src/screens/ProjectDetailsScreen';
import ComplaintFormScreen from './src/screens/ComplaintFormScreen';
import ProjectListScreen from './src/screens/ProjectListScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator initialRouteName="ProjectList">
        <Stack.Screen
          name="ProjectList"
          component={ProjectListScreen}
          options={{ title: 'Road Projects' }}
        />
        <Stack.Screen
          name="ProjectDetails"
          component={ProjectDetailsScreen}
          options={{ title: 'Project Details' }}
        />
        <Stack.Screen
          name="ComplaintForm"
          component={ComplaintFormScreen}
          options={{ title: 'Submit Complaint' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
