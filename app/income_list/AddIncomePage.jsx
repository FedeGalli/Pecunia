import { View } from "react-native"
import { Stack, useFocusEffect } from "expo-router"
import SubmitButton from '../components/SubmitButton.jsx'
import { useState, useEffect } from 'react'
import * as React from 'react'
import { TextInput, StyleSheet } from "react-native"
import { Picker } from '@react-native-picker/picker';
import NewCategoryButton from "../components/NewCategoryButton.jsx"
import * as SecureStore from 'expo-secure-store';

async function getCategories() {
    data = []
    let response = await SecureStore.getItemAsync('icat0')
    let i = 1

    while (i <= response) {
        category = await SecureStore.getItemAsync('icat' + i.toString())
        if (category) {
            data.push(category)
        }
        i++
    }
    if (data) {
        print(data)
        return data
    }
    else {
        return []
    }
}


const AddIncomePage = () => {
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [triggerDataReload, setTriggerDataReload] = useState(true)
    const [availableCategories, setAvailableCategories] = useState([])

    const renderCategoriesList = () => {
        return availableCategories.map((category) => {
          return <Picker.Item label={category} value={category} />
        })
    }

    useFocusEffect(
        React.useCallback(() => {
          let isActive = true;
    
          const fetchCategories = async () => {
            getCategories()
              .then((data) => {
                if (isActive) {
                  setAvailableCategories(data)
                  setTriggerDataReload(false)
                }
              })
              .catch(() => {
                console.log('error')
              })
          };
          fetchCategories();
          return () => {
            isActive = false;
          };
        }, [triggerDataReload])
      )

    return(
        <View>
            <Stack.Screen options={{
                headerTitle: 'New Income'
            }}/>
            <TextInput 
                style={styles.input}
                onChangeText={setAmount}
                value={amount.toString()}
                keyboardType={'numeric'}
                placeholder={'Amount'}
            />
            <Picker
                selectedValue={category}
                onValueChange={(itemValue, itemIndex) => {
                    setCategory(itemValue)
                }
                }>
                {renderCategoriesList()}
            </Picker>
            <NewCategoryButton redirectType={'income'} onPress={ () => {
                setTriggerDataReload(true)
            }}/>
            <SubmitButton amount={amount} category={category} redirectType={'income'}/>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
})

export default AddIncomePage