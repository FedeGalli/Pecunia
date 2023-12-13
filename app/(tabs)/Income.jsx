import { Stack, useFocusEffect } from 'expo-router'
import {View, Text } from 'react-native'
import AddButton from '../components/AddButton.jsx'
import { useState, useEffect } from 'react'
import * as React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store';
import { TouchableOpacity } from 'react-native'
import EntryRenderer from '../components/EntryRenderer.jsx'

async function removeValue() {
  await SecureStore.deleteItemAsync('i0')
  await SecureStore.deleteItemAsync('i1')
  await SecureStore.deleteItemAsync('i2')
  await SecureStore.deleteItemAsync('i3')
  await SecureStore.deleteItemAsync('i4')
  alert('items removed')
}

async function getIncomesData() {
  data = []
  let response = await SecureStore.getItemAsync('i0')
  let i = 1
  
  while (i <= response) {
    incomeEntry = await SecureStore.getItemAsync('i' + i.toString())
    if (incomeEntry){
      data.push(JSON.parse(incomeEntry))
    }
    i++
  }
  if (data) {
    return data
  }
  else {
    return []
  }
}

function getMonthlyIncomes(data) {
    date = new Date()
    currentMonth = date.getMonth() + 1
    sum = 0
    data.forEach(element => {
        if (element.month === currentMonth) {
            sum += parseFloat(element.amount)
        }
    });
    return sum
}


const Income = () => {
    const [data, setData] = useState([])
    const [triggerDataReload, setTriggerDataReload] = useState(true)
    const [totalMonthlyIncomes, setMonthlyIncomes] = useState(true)

    useFocusEffect(
      React.useCallback(() => {
        let isActive = true;
    
        const fetchIncomeData = async () => {
            getIncomesData()
            .then((data) => {
              if (isActive) {
                setData(data)

                const totalIncomes = getMonthlyIncomes(data)
                setMonthlyIncomes(totalIncomes)

                setTriggerDataReload(false)
              }
            })
            .catch(() => {
              console.log('error')
            })

        };
    
        fetchIncomeData();

    
        return () => {
          isActive = false;
        };
      }, [triggerDataReload])
    )

    return(
        <View style={{flex: 1}}>
            <Stack.Screen options={{
              headerTitle: 'Income'
            }} />

            <Text>Monthly incomes are: {totalMonthlyIncomes}€</Text>
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
              renderItem={({item}) => <EntryRenderer index={item.index} amount={item.amount} category={item.category} timestamp={`${item.day}/${item.month}/${item.year}`} redirectType={'income'}/>}
              keyExtractor={item => item.index}
            />
            <AddButton redirectType={'income'}/>
        </View>
    )
}

export default Income