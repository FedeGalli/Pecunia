import { Link, Stack, useLocalSearchParams } from 'expo-router'
import {View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AddExpenseButton from '../components/AddExpenseButton.jsx'
import { useState, useEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store';
import { TouchableOpacity } from 'react-native'

async function removeValue() {
  await SecureStore.deleteItemAsync('0')
  await SecureStore.deleteItemAsync('1')
  await SecureStore.deleteItemAsync('2')
  await SecureStore.deleteItemAsync('3')
  await SecureStore.deleteItemAsync('4')
  alert('Content deleted')
}

async function getExpensesData(data) {
  let response = await SecureStore.getItemAsync('0')
  let i = 1

  while (i <= response) {
    data.push(JSON.parse(await SecureStore.getItemAsync(i.toString())))
    i++
  }
}

const data = []
getExpensesData(data)
//const data = getExpensesData()

const Expense = () => {
    
    const [a, setA] = useState('0')
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
              //removeValue()
              getNemberOfExpeneses(setA)
            }}>
            <Text style={{fontSize:16, marginBottom: 50}}>Numbers of items</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => {
              removeValue()
            }}>
            <Text style={{fontSize:16, marginBottom: 50}}>Remove items</Text>
            </TouchableOpacity>
            <FlatList
              data={data}
              renderItem={({item}) => <Text style={{fontSize: 16}}>{item.index} {item.amount} {item.category}</Text>}
              keyExtractor={item => item.index}
            />
            <AddExpenseButton />
        </View>
    )
}

export default Expense