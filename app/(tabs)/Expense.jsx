import { Link, Stack, useFocusEffect } from 'expo-router'
import {View, Text } from 'react-native'
import AddButton from '../components/AddButton.jsx'
import { useState, useEffect } from 'react'
import * as React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store';
import { TouchableOpacity } from 'react-native'
import ExpenseRenderer from '../components/EntryRenderer.jsx'
import EntryRenderer from '../components/EntryRenderer.jsx'

async function removeValue() {
  await SecureStore.deleteItemAsync('e0')
  await SecureStore.deleteItemAsync('e1')
  await SecureStore.deleteItemAsync('e2')
  await SecureStore.deleteItemAsync('e3')
  await SecureStore.deleteItemAsync('e4')
  alert('items removed')
}

async function getExpensesData() {
  data = []
  let response = await SecureStore.getItemAsync('e0')
  let i = 1
  
  while (i <= response) {
    expenseEntry = await SecureStore.getItemAsync('e' + i.toString())
    if (expenseEntry){
      data.push(JSON.parse(expenseEntry))
    }
    i++
  }
  console.log(data)
  if (data) {
    return data
  }
  else {
    return []
  }
}


const Expense = () => {
    const [data, setData] = useState([])
    const [triggerDataReload, setTriggerDataReload] = useState(true)

    useFocusEffect(
      React.useCallback(() => {
        let isActive = true;
    
        const fetchExpenseData = async () => {
            getExpensesData()
            .then((data) => {
              if (isActive) {
                setData(data)
                setTriggerDataReload(false)
              }
            })
            .catch(() => {
              console.log('error')
            })
        };
    
        fetchExpenseData();
    
        return () => {
          isActive = false;
        };
      }, [triggerDataReload])
    )

    return(
        <View style={{flex: 1}}>
            <Stack.Screen options={{
              headerTitle: 'Expense'
            }} />
            <TouchableOpacity onPress={
              async () => {
                removeValue().then(() => {
                  setTriggerDataReload(true)
                })}
              
            }>
            <Text style={{fontSize:16, marginBottom: 50}}>Remove items</Text>
            </TouchableOpacity>
            <FlatList
              data={data}
              renderItem={({item}) => <EntryRenderer index={item.index} amount={item.amount} category={item.category} timestamp={item.timestamp} redirectType={'expense'}/>}
              keyExtractor={item => item.index}
            />
            <AddButton redirectType={'expense'}/>
        </View>
    )
}

export default Expense