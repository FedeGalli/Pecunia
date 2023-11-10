import { Link, Stack, useLocalSearchParams } from 'expo-router'
import {View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AddExpenseButton from '../components/AddExpenseButton.jsx'
import { useState, useEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store';
import { TouchableOpacity } from 'react-native'

async function removeValue(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Removing 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }

  await SecureStore.deleteItemAsync(key)
}

async function fetchExpenses() {
  let values = []
  const nItems = await SecureStore.getItemAsync('len')
  let i = 0
  if (nItems != 0) {
    while(i <= nItems) {
      values.push(JSON.parse(await SecureStore.getItemAsync(String.toString(i)))) 
      i = i + 1
    }
    return values
  }
  return []

}




const Expense = () => {
    //const data = fetchExpenses()
    //const [numberOfItems, setNumberOfItems] = useState(getNumberOfItems())
    //const { amount } = useLocalSearchParams();
    //const { category } = useLocalSearchParams();
    return(
        <View style={{flex: 1}}>
            <Stack.Screen options={{
              headerTitle: 'Expense'
            }} />
            <TouchableOpacity onPress={ () => {
              //removeValue(numberOfItems)
              //setNumberOfItems(numberOfItems - 1)
            }}>
            <Text style={{fontSize:32}}>Numbers of items : {}</Text>
            </TouchableOpacity>

            <AddExpenseButton />
        </View>
    )
}

export default Expense