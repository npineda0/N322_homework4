import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, List, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ListItemScreen({ navigation, route }) {
  let dataObj = route.params;

  const [currentList, setCurrentList] = useState();
  const [allLists, setAllLists ] = useState();
  //items in list are stored in array
  const [currentItems, setCurrentItems] = useState([]);
  //set list item names
  const [itemName, setItemName] = useState();

  useEffect(() => {
    getCurrentList();
  }, []);

  const getCurrentList = async () => {
    try {
      const lists = await AsyncStorage.getItem('lists');
      if(!lists) {
        //setNoListMessage("You have no lists at this time. please add a list");
      } else {
        setCurrentList(JSON.parse(lists)[dataObj.index]);
        setCurrentItems(JSON.parse(lists)[dataObj.index].items);
        setAllLists(JSON.parse(lists));
      }
    } catch(e) {
      console.log('detail get data error', e);
    }
  };

  const saveData = async () => {
    currentList.items.push({itemTitle: itemName});
    setCurrentItems(currentList.items)
    //once item is saved the input field is cleared
    setItemName('');
  }

  const updateItemArray = async (filterArray) => {
    currentList.items = filterArray;
    allLists[dataObj.index] = currentList;
    let newList = {};
    updateData();
  };

  const updateData = async () => {
    await AsyncStorage.setItem('lists', JSON.stringify(allLists));
  }

  return (
    <View>
      <View>
      <TouchableOpacity
          style={styles.backButton}
          title="Go to Home"
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>Back </Text>
        </TouchableOpacity>
        </View>
      <View>
        <h1 style={styles.itemTitle}>{dataObj.title}</h1>
      </View>
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Add Items to Your List!
        </Text>
      </View>
      <View style={styles.container}>
        <TextInput
          placeholder="Item Name"
          onChangeText={setItemName}
          value={itemName}
        />
        <Button onPress={saveData}><Text>Save List Item</Text></Button>
      </View>
      <View>
        {currentItems.map((item, idx) => (
          <List.Item
            style={styles.lists}
            title={item.itemTitle}
            onPress={() =>
              navigation.navigate('ListItems', {
                title: item.itemTitle,
                index: idx,
              })
            }
            right={(props) => (
              <IconButton
                onPress={() => {
                  setCurrentItems(currentItems.filter((a) => a.itemTitle !== item.itemTitle));
                  
                  updateItemArray(
                    currentItems.filter((a) => a.itemTitle !== item.itemTitle)
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
    padding: 6
  },
  backButton: {
    backgroundColor: '#8e4af0',
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  itemTitle: {
    textAlign: 'center'
  },
  paragraph: {
    //padding: 8,
  },
   lists: {
    width: 320,
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#ad7ff0',
    marginBottom: 10,
    borderRadius: 20,
  }
});