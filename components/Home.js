import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, List, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation, route}) {
  const [listName, setListName] = useState();
  //empty string to let user know if they've written a list 
  const [noListMessage, setNoListMessage] = useState('');
  //save data and store in empty array
  const [allData, setAllData] = useState([]);


  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const lists = await AsyncStorage.getItem('lists');
      if (!lists) {
        setNoListMessage('No Lists Have Been Created. Make a List!');
      } else {
        setAllData(JSON.parse(lists));
      }
    } catch (e) {
      console.log('ASSET GET DATA ERROR ', e);
    }
  };

  const saveData = async () => {
    let newArray = [];

    let newObj = { name: listName, items: [] };
    if (allData.length != 0) {
      newArray = allData;
      newArray.push(newObj);
    } else {
      newArray.push(newObj);
    }
    //once listName is saved the name is cleared
    setListName("");
    await AsyncStorage.setItem('lists', JSON.stringify(newArray));
    getData();
  };

  const updateDeletedArray = async (filterArray) => {
    await AsyncStorage.setItem('lists', JSON.stringify(filterArray));
    getData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {noListMessage ? <Text>{noListMessage}</Text> : ''}
        <Text style={styles.homeHeader}>LIST APP</Text>
        <Text>Add List Name:</Text>
        <TextInput
          placeholder="List Name"
          onChangeText={setListName}
          value={listName}
        />
        <Button onPress={saveData}>Save List Name</Button>
        {listName ? <Text>{listName}</Text> : <Text>Lists</Text>}
        {allData ? <Text>{allData.name}</Text> : <Text>No Data</Text>}
      </View>
      <View>
        {allData.map((list, idx) => (
          <List.Item
            style={styles.lists}
            title={list.name}
            onPress={() =>
              navigation.navigate('ListItems', {
                title: list.name,
                index: idx,
              })
            }
            right={(props) => (
              <IconButton
                onPress={() => {
                  setAllData(allData.filter((a) => a.name !== list.name));
                  updateDeletedArray(
                    allData.filter((a) => a.name !== list.name)
                  );
                }}
                icon="delete"
                size={20}
              />
            )}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
  homeHeader: {
    fontSize: 22,
    marginBottom: 20,
    padding: 5,
    textAlign: 'center',
  },
  lists: {
    width: 320,
    alignItems: 'center',
    backgroundColor: '#ad7ff0',
    marginBottom: 10,
    borderRadius: 20,
  }
});
