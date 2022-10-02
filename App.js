import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, TextInput, Text, FlatList} from 'react-native';
import * as SQLite from'expo-sqlite';

export default function App() {

  const [product, setProduct ] = useState("");
  const [amount, setAmount ] = useState("");
  const [shoppingList, setShoppingList] = useState([]);


  //DATABASE STUFF
  const db = SQLite.openDatabase('shoppingListDB.db'); //Open database (Returns database object) and create it, if it doesn’t exists.

  //update view
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from products;', [], (_, { rows }) => setShoppingList(rows._array))
    }, null, null)
  }

  //delete item
  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from products where id = ?;', [id])
    }, null, updateList) 
  }

  //add item
  const addItemToShoppingList = () => {
    let newItem = product;
    let newAmount = amount;
    db.transaction(tx => {
      tx.executeSql('insert into products (product, amount) values (?, ?);', [newItem, newAmount])
    }, null, updateList)
    setProduct("")
    setAmount("")
  }

  //create table if it does not exist
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists products (id integer primary key not null, product text, amount text);')
    }, null, updateList)
  }, []);



  return (
    <>
      <View style={styles.containerHeader}>
        <Text style={styles.assignmentHeaderText}>TEHT 11 OSTOSLISTA SQLite</Text>
      </View>
      <View style={styles.container}>
        <Text style={{color:"white"}}>PRODUCT</Text>
        <TextInput style={styles.input} onChangeText={setProduct} value={product}/>
        <Text style={{color:"white"}}>AMOUNT</Text>
        <TextInput style={styles.input} onChangeText={setAmount} value={amount}/>
        <View style={{display: 'flex', flexDirection: 'row', margin: 10}}>
          <View style={{flex: 1, marginHorizontal: 20}}>
            <Button color="green" onPress={() => addItemToShoppingList()} title="Add" />
          </View>
        </View>
        <StatusBar style="auto" />
      </View>
      <View style={styles.container2}>
        <Text style={{color:"#6495ED", fontSize:24}}>SHOPPING LIST</Text>
        <FlatList 
          style={styles.list}
          data={shoppingList}
          keyExtractor={item => item.id.toString()} 
          renderItem={({ item }) =>
            <View style={styles.shoppingList}>
              <Text style={{color:"white", marginHorizontal: 20}}>{item.product} {item.amount}</Text>
              <Button color="brown" title="Bought" onPress={() => deleteItem(item.id)}></Button>
            </View>}  
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: 'black',
  },
  containerHeader: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  container2: {
    flex: 2,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  shoppingList: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    margin: 10
  },
  input : {
    width:"80%", 
    borderColor: 'gray', 
    borderWidth: 1,
    margin: 5,
    color:"white",
  },
  assignmentHeaderText: {
    fontSize: 40,
    color:"#6495ED",
  }
});
 
