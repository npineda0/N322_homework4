import { Text, SafeAreaView, View, StyleSheet } from 'react-native';
//wrap all navigation to navigate from one screen to another
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// importing componets 
import Home from './components/Home';
import ListItemScreen from './components/ListItemScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="ListItems"
            component={ListItemScreen}
            options={{ title: 'List Items' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
