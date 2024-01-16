import {  Stack, useFocusEffect } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { useState, useRef, useMemo, useCallback } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store';
import { TouchableOpacity } from 'react-native-gesture-handler'
import EntryRenderer from '../components/EntryRenderer.jsx'
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet'
import AddIncomePage from '../income_list/AddIncomePage.jsx'
import CustomBackdrop from '../components/CustomBackdrop.jsx'

async function removeValue() {
  await SecureStore.deleteItemAsync('i0')
  await SecureStore.deleteItemAsync('i1')
  await SecureStore.deleteItemAsync('i2')
  await SecureStore.deleteItemAsync('i3')
  await SecureStore.deleteItemAsync('i4')
  await SecureStore.deleteItemAsync('icat0')
  await SecureStore.deleteItemAsync('icat1')
  await SecureStore.deleteItemAsync('icat2')
  await SecureStore.deleteItemAsync('icat3')
  await SecureStore.deleteItemAsync('icat4')
  alert('items removed')
}

async function getExpensesData() {
  const data = []
  const response = parseInt(await SecureStore.getItemAsync('i0')) 
  let i = 1

  while (i <= response) {
    const expenseEntry = await SecureStore.getItemAsync('i' + i.toString())
    if (expenseEntry) {
      data.push(JSON.parse(expenseEntry))
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

function getMonthlyIncome(data) {
  const date = new Date()
  const currentMonth = date.getMonth() + 1
  let sum = 0
  data.forEach(element => {
    if (element.month === currentMonth) {
      sum += parseFloat(element.amount)
    }
  });
  return sum
}


const Income = () => {

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['5%', '80%'], []);

  const [data, setData] = useState([])
  const [triggerDataReload, setTriggerDataReload] = useState(true)
  const [totalMonthlyIncome, setMonthlyIncome] = useState(true)


  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchExpenseData = async () => {
        getExpensesData()
          .then((data) => {
            if (isActive) {
              setData(data)
              const totalIncome = getMonthlyIncome(data)
              setMonthlyIncome(totalIncome)
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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerTitle: 'Income'
      }} />
      <Text>Monthly incomes are: {totalMonthlyIncome}€</Text>

      <FlatList
        data={data}
        renderItem={({ item }) => <EntryRenderer index={item.index} amount={item.amount} category={item.category} timestamp={`${item.day}/${item.month}/${item.year}`} redirectType={'income'} />}
        keyExtractor={item => item.index}
      />

      <TouchableOpacity onPress={
        async () => {
          removeValue().then(() => {
            setTriggerDataReload(true)
          })
        }
      }
      style={{    
        marginTop: 8,
        marginBottom: 100,
        borderRadius: 10,
        fontSize: 16,
        lineHeight: 20,
        padding: 8,
        backgroundColor: 'rgba(151, 151, 151, 0.25)'}}>
      <Text>Remove items</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        onChange={ () => {
          setTriggerDataReload(true)
        }}
        keyboardBlurBehavior='restore'
        keyboardBehavior='extend'
        backdropComponent={CustomBackdrop}
        android_keyboardInputMode='adjustResize'
      >
        <BottomSheetView>
          <BottomSheetView>
            <AddIncomePage bottomSheetRef={bottomSheetRef}/>
          </BottomSheetView>

        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  bottomSheetTextInput : {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  }
})


//<AddButton redirectType={'expense'} />
export default Income