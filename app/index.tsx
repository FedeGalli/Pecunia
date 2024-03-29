import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useRef, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Switch, Dimensions,TextInput } from 'react-native';
import BottomSheet, { TouchableOpacity } from '@gorhom/bottom-sheet'
import SwitchSelector from './components/SwitchSelector';
import NumPad from './components/NumPad';
import { FlatList } from "react-native-gesture-handler"
import CategoryEntryRenderer from './components/CategoryEntryRenderer';
import NewCategoryPage from './components/NewCategoryPage';
import { useFocusEffect } from "expo-router"
import * as SecureStore from 'expo-secure-store';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  useBottomSheetModal
} from '@gorhom/bottom-sheet';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { Svg, Text as TextSVG } from 'react-native-svg';


async function getCategories(selectedCategory: string) {
  const data = []
  let response = await SecureStore.getItemAsync(selectedCategory + 'cat0')
  let i = 1
  while (i <= parseInt(response || '-1')) {
    const category = await SecureStore.getItemAsync(selectedCategory + 'cat' + i.toString())
    if (category) {
      data.push(JSON.parse(category))
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
async function getData() {
  const data = []
  let response = await SecureStore.getItemAsync('0')
  let i = parseInt(response || '-1')
  while (i >= 1) {
    const entry = await SecureStore.getItemAsync(i.toString())
    if (entry) {
      data.push(JSON.parse(entry))
    }
    i--
  }
  if (data) {
    return data
  }
  else {
    return []
  }
}
function getWeekNumber(d: any) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
  // Return array of year and week number
  return weekNo;
}
function grupByCurrentWeekDay(data: any): any {

  const date = new Date()
  const currentDay = date.getDay()
  const currentMonth = date.getMonth() + 1
  const currentYear = date.getFullYear()
  const currentWeek = getWeekNumber(date)

  let groupedData = [0, 0, 0, 0, 0, 0, 0]
  let baseValue = 0
  for (let i = 0; i < data.length; i++) {
    if (data[i].week === currentWeek) {
      if (data[i].weekDay === 0) {
        groupedData[6] += data[i].type === 'e' ? -parseFloat(data[i].amount) : parseFloat(data[i].amount)
      }
      else {
        groupedData[data[i].weekDay - 1] += data[i].type === 'e' ? -parseFloat(data[i].amount) : parseFloat(data[i].amount)
      }
    }
    else {
      baseValue += data[i].type === 'e' ? -parseFloat(data[i].amount) : parseFloat(data[i].amount)
    }
  }
  for (let i = 0; i < groupedData.length; i++) {
    if (i === 0) {
      groupedData[i] = baseValue + groupedData[i]
    } else {
      groupedData[i] = groupedData[i - 1] + groupedData[i]
    }
  }

  return groupedData
}
async function removeValue() {
  for (let i = 0; i < 25; i++) {
    await SecureStore.deleteItemAsync(i.toString())
    await SecureStore.deleteItemAsync('icat' + i.toString())
    await SecureStore.deleteItemAsync('ecat' + i.toString())
  }

  alert('items removed')
}
async function removeEntry(index: any) {
  const maxLen = await SecureStore.getItemAsync('0')

  if (maxLen !== null) {
    for (let i = index; i < maxLen; i++) {
      const item = JSON.parse(await SecureStore.getItemAsync((i + 1).toString()) || "")
      if (item) {
        await SecureStore.deleteItemAsync((i).toString())
        await SecureStore.setItemAsync((i).toString(), JSON.stringify({ index: i, amount: item.amount, category: item.category, day: item.day, weekDay: item.weekDay, week: item.week, month: item.month, year: item.year, type: item.type, isSync: item.isSync }))
      }
    }
    await SecureStore.setItemAsync('0', (parseInt(maxLen) - 1).toString())
    await SecureStore.deleteItemAsync(maxLen.toString())
  }
}
const fetchGoogleAPI = async (body: object, apiName: string) => {
  let response = ""
  try {
    const res = await fetch(`http://192.168.1.114:8000/${apiName}/`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    response = await res.json()

  } catch (error) {
    return error
  }

  return response
}


export default function TabOneScreen() {

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [selectedEntry, setSelectedEntry] = useState(Object)
  const [triggerDataReload, setTriggerDataReload] = useState(true)
  const [availableCategories, setAvailableCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('e')
  const [description, setDescription] = useState('')
  const [incomeExpenseData, setIncomeExpenseData] = useState([])
  const [groupedIncomeExpenseData, setGroupedIncomeExpenseData] = useState([0])

  const bottomSheetRefNumPad = useRef<BottomSheetModal>(null);
  const bottomSheetEntryStatus = useRef<BottomSheetModal>(null);
  const bottomSheetRefCategory = useRef<BottomSheetModal>(null);
  const bottomSheetRefNewCategory = useRef<BottomSheetModal>(null);
  const bottomSheetRefEditCategory = useRef<BottomSheetModal>(null);
  const bottomSheetRefList = useRef<BottomSheetModal>(null);
  const bottomSheetRefEditEntry = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['95%'], []);
  const statusSnapPoints = useMemo(() => ['25%'], []);

  const handleOpenNumPad = useCallback(() => {
    bottomSheetRefNumPad.current?.present();
  }, [])
  const handleOpenCategory = useCallback(() => {
    bottomSheetRefCategory.current?.present();
  }, [])
  const handleOpenEditEntry = useCallback(() => {
    bottomSheetRefEditEntry.current?.present();
  }, [])
  const handleCloseEditEntry = useCallback(() => {
    bottomSheetRefEditEntry.current?.dismiss();
  }, [])
  const handleOpenNewCategory = useCallback(() => {
    bottomSheetRefNewCategory.current?.present();
  }, [])
  const handleOpenEntryStatus = useCallback(() => {
    bottomSheetEntryStatus.current?.present();
  }, [])
  const handleCloseEntryStatus = useCallback(() => {
    bottomSheetEntryStatus.current?.dismiss();
  }, [])
  const handleCloseNewCategory = useCallback(() => {
    bottomSheetRefNewCategory.current?.dismiss();
  }, [])
  const handleOpenList = useCallback(() => {
    bottomSheetRefList.current?.present();
  }, [])
  const handleCloseAll = useCallback(() => {
    bottomSheetRefNumPad.current?.dismiss();
    bottomSheetRefCategory.current?.dismiss();
    bottomSheetRefNewCategory.current?.dismiss();
  }, [])
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []
  )

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchCategories = async () => {
        getCategories(selectedCategory)
          .then((data: any) => {
            if (isActive) {
              setAvailableCategories(data)
              setTriggerDataReload(false)
            }
          })
          .catch(() => {
            console.log('error')
          })
      };
      const fetchData = async () => {
        getData()
          .then((data: any) => {
            if (isActive) {
              setIncomeExpenseData(data)
              const x = grupByCurrentWeekDay(data)
              setGroupedIncomeExpenseData(x)
              setTriggerDataReload(false)
            }
          })
          .catch(() => {
            console.log('error')
          })
      };
      fetchCategories();
      fetchData()
      return () => {
        isActive = false;
      };
    }, [triggerDataReload])
  )

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              removeValue()
              setTriggerDataReload(true)
            }}
          >
            <Text style={{ fontSize: 30 }}>  - Remove </Text>
          </TouchableOpacity>
          <LineChart
            data={{
              labels: ["M", "T", "W", "T", "F", "S", "S"],
              datasets: [
                {
                  data: groupedIncomeExpenseData
                }
              ]
            }}
            width={Dimensions.get("window").width} // from react-native
            height={250}
            withHorizontalLabels={true}
            yAxisLabel="$"
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            fromNumber={Math.max(...(groupedIncomeExpenseData ? groupedIncomeExpenseData : [0, 0, 0, 0, 0, 0, 0])) * 1.1}
            fromZero={true}

            chartConfig={{
              backgroundColor: "#ffffff00",
              backgroundGradientFrom: "#ffffff00",
              backgroundGradientTo: "#ffffff00",
              decimalPlaces: 0, // optional, defaults to 2dp
              propsForBackgroundLines: {
                strokeWidth: 0
              },
              color: (opacity = 0.23) => `rgba(214, 101, 133, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#0000004f"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
            renderDotContent={({ x, y, index }) => { //point labels
              return (
                <TextSVG
                  key={index}
                  x={x}
                  y={y - 10}
                  fill="black"
                  fontSize="12"
                  fontWeight="normal"
                  textAnchor="middle">
                  {groupedIncomeExpenseData[index]}
                </TextSVG>
              );
            }}
          />


          <TouchableOpacity
            onPress={handleOpenList}
            style={styles.add_button}
          >
            <Text style={{ fontSize: 30 }}>  List  </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOpenNumPad}
            style={styles.add_button}
          >
            <Text style={{ fontSize: 30 }}>  + Add  </Text>
          </TouchableOpacity>

          <BottomSheetModal //list bottom tab
            ref={bottomSheetRefList}
            index={0}
            snapPoints={snapPoints}
            stackBehavior='push'
            backdropComponent={renderBackdrop}
          >
            <View style={styles.contentContainer}>

              <FlatList
                data={incomeExpenseData}
                renderItem={({ item }: any) =>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedEntry(item)
                      handleOpenEditEntry()
                    }}
                  >
                    <Text style={{ marginTop: 30, fontSize: 30, color: item.type === 'e' ? 'red' : 'green' }}> {item.type} {item.index} {item.category} {item.amount}</Text>
                  </TouchableOpacity>
                }
                keyExtractor={(item: any) => item.index}
              />
            </View>
          </BottomSheetModal>

          <BottomSheetModal //numpad bottom tab
            ref={bottomSheetRefNumPad}
            index={0}
            snapPoints={snapPoints}
            stackBehavior='replace'
            backdropComponent={renderBackdrop}
            onDismiss={() => setSelectedCategory('e')}
          >
            <View style={styles.contentContainer}>

              <SwitchSelector setSelectedCategory={setSelectedCategory} />
              <NumPad setAmount={setAmount} />

              <TouchableOpacity
                style={styles.add_button}
                onPress={() => {
                  if (amount !== '' && amount !== '0') {

                    handleOpenCategory()
                  }
                  else {
                    alert("Insert a number")
                  }

                }}
              >
                <Text style={{ fontSize: 40 }}>Enter</Text>
              </TouchableOpacity>

            </View>
          </BottomSheetModal>

          <BottomSheetModal //category bottom tab
            ref={bottomSheetRefCategory}
            index={0}
            snapPoints={snapPoints}
            stackBehavior='push'
            backdropComponent={renderBackdrop}
          >
            <View style={styles.contentContainer}>

              <TouchableOpacity
                onPress={handleOpenNewCategory}
                style={styles.button}
              >
                <FontAwesome6 name="pencil" size={50} color="black" />
              </TouchableOpacity>

              <FlatList
                data={availableCategories}
                renderItem={({ item }: any) => <CategoryEntryRenderer index={item.index} name={item.name} type={item.type} setCategory={setCategory} setReload={setTriggerDataReload} selectedCategory={category} />}
                keyExtractor={(item: any) => item.index}
                style={{ marginTop: 30 }}
              />

              <TextInput
                onChangeText={setDescription}
                value={description}
                keyboardType={'default'}
                placeholder={'Insert a description (optional)'}
              />

              <TouchableOpacity
                onPress={async () => {
                  if (category !== '') {
                    handleCloseAll()

                    const prefix = selectedCategory
                    const result = await SecureStore.getItemAsync('0');
                    const date = new Date()
                    const day = date.getDate()
                    const weekDay = date.getDay()
                    const month = date.getMonth() + 1
                    const year = date.getFullYear()
                    const week = getWeekNumber(date)

                    const body = {
                      user: "Federico",
                      type: prefix,
                      category: category,
                      timestamp: "" + day + "/" + month + "/" + year,
                      amount: amount,
                      description: description
                    }

                    const response = await fetchGoogleAPI(body, 'insert_entry') === '200' ? true : false

                    if (result) {
                      let index = (parseInt(result, 10) + 1).toString()
                      const value = JSON.stringify({ index: (parseInt(result, 10) + 1), amount: amount, category: category, day: day, weekDay: weekDay, week: week, month: month, year: year, type: prefix, description:description, isSync: response })
                      await SecureStore.setItemAsync('0', index)
                      await SecureStore.setItemAsync(index, value)
                    } else {
                      const value = JSON.stringify({ index: 1, amount: amount, category: category, day: day, weekDay: weekDay, week: week, month: month, year: year, type: prefix, description:description, isSync: response })
                      await SecureStore.setItemAsync('0', '1')
                      await SecureStore.setItemAsync('1', value)
                    }
                    setCategory('')
                    setDescription('')
                    setTriggerDataReload(true)
                    handleOpenEntryStatus()
                  } else {
                    alert('Select a valid category!!!')
                  }

                }}
                style={styles.button}
              >
                <Text style={{ fontSize: 30 }}>  Enter  </Text>
              </TouchableOpacity>

            </View>
          </BottomSheetModal>

          <BottomSheetModal //new category bottom tab
            ref={bottomSheetRefNewCategory}
            index={0}
            snapPoints={snapPoints}
            stackBehavior='push'
            backdropComponent={renderBackdrop}
          >
            <View style={styles.contentContainer}>
              <NewCategoryPage type={selectedCategory} dismiss={handleCloseNewCategory} dataReaload={setTriggerDataReload} />
            </View>
          </BottomSheetModal>

          <BottomSheetModal //edit category bottom tab (todo)
            ref={bottomSheetRefEditCategory}
            index={0}
            snapPoints={snapPoints}
            stackBehavior='push'
            backdropComponent={renderBackdrop}
          >
            <View style={styles.contentContainer}>
            </View>
          </BottomSheetModal>

          <BottomSheetModal //edit entry bottom tab (todo)
            ref={bottomSheetRefEditEntry}
            index={0}
            snapPoints={snapPoints}
            stackBehavior='push'
            backdropComponent={renderBackdrop}
          >
            <View style={styles.contentContainer}>
              <TouchableOpacity
                onPress={() => { }}
                style={styles.add_button}
              >
                <Text style={{ fontSize: 30 }}>  Edit  </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  const body = {
                    user: "Federico",
                    index: selectedEntry.index.toString()
                  }
                  try {
                    fetchGoogleAPI(body, 'delete_entry')
                    removeEntry(selectedEntry.index).then(() => {
                      setTriggerDataReload(true)
                      handleCloseEditEntry()
                    })
                  } catch (error) {

                  }
                }}
                style={styles.add_button}
              >
                <Text style={{ fontSize: 30 }}>  Delete </Text>
              </TouchableOpacity>

              <Text style={{ marginTop: 30, fontSize: 30, color: selectedEntry.type === 'e' ? 'red' : 'green' }}> {selectedEntry.type} {selectedEntry.index} {selectedEntry.week} {selectedEntry.category} {selectedEntry.amount}</Text>

            </View>
          </BottomSheetModal>

          <BottomSheetModal //edit entry bottom tab (todo)
            ref={bottomSheetEntryStatus}
            index={0}
            snapPoints={statusSnapPoints}
            stackBehavior='push'
            detached={true}
            style={styles.status_sheet_container}
            bottomInset={46}
            backdropComponent={renderBackdrop}
          >
            <View style={styles.status_content_container}>
              <Text style={{ marginTop: 30, fontSize: 30}}> Awesome 🎉 </Text>
            </View>
          </BottomSheetModal>



        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    marginRight: 280
  },
  add_button: {
    borderRadius: 20,
    backgroundColor: '#fcba03',
    marginLeft: 250,
    marginBottom: 50
  },
  status_sheet_container: {
    marginHorizontal: 24
  },
  status_content_container: {
    flex: 1,
    alignItems: "center",
  },
});
