import { Link, Stack, useLocalSearchParams, useFocusEffect } from 'expo-router'
import {View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AddExpenseButton from '../components/AddExpenseButton.jsx'
import { useState, useEffect } from 'react'
import * as React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store';
import { TouchableOpacity } from 'react-native'
import ExpenseRenderer from '../components/ExpenseRenderer.jsx'

async function removeValue() {
  await SecureStore.deleteItemAsync('0')
  await SecureStore.deleteItemAsync('1')
  await SecureStore.deleteItemAsync('2')
  await SecureStore.deleteItemAsync('3')
  await SecureStore.deleteItemAsync('4')
  alert('Content deleted')
}

async function getExpensesData() {
  data = []
  let response = await SecureStore.getItemAsync('0')
  let i = 1

  while (i <= response) {
    data.push(JSON.parse(await SecureStore.getItemAsync(i.toString())))
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

//const data = getExpensesData()

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
    //const data = fetchExpenses()
    //const [numberOfItems, setNumberOfItems] = useState(getNumberOfItems())
    //const { amount } = useLocalSearchParams();
    //const { category } = useLocalSearchParams();
    /*

    */
    return(
        <View style={{flex: 1}}>
            <Stack.Screen options={{
              headerTitle: 'Expense'
            }} />
            <TouchableOpacity onPress={ () => {
              //removeValue()
            }}>
            <Text style={{fontSize:16, marginBottom: 50}}>Numbers of items</Text>
            </TouchableOpacity>
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
              renderItem={({item}) => <ExpenseRenderer index={item.index} amount={item.amount} category={item.category}/>}
              keyExtractor={item => item.index}
            />
            <AddExpenseButton />
        </View>
    )
}

export default Expense