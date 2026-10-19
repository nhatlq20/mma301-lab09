import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { initDatabase } from './src/database/database';
import MoviesListScreen from './src/screens/MoviesListScreen';
import AddMovieScreen from './src/screens/AddMovieScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import EditMovieScreen from './src/screens/EditMovieScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MoviesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MoviesList"
        component={MoviesListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddMovie"
        component={AddMovieScreen}
        options={{
          headerTitle: 'Add Movie',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
        options={{
          headerTitle: 'Movie Detail',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }}
      />
      <Stack.Screen
        name="EditMovie"
        component={EditMovieScreen}
        options={{
          headerTitle: 'Edit Movie',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initDatabase();
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2979ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = route.name === 'Movies'
              ? (focused ? 'film' : 'film-outline')
              : (focused ? 'stats-chart' : 'stats-chart-outline');
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2979ff',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Movies" component={MoviesStack} />
        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{ headerShown: true, headerTitle: 'Statistics' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}