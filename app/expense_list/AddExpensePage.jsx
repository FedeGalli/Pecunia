import { useFocusEffect } from "expo-router"
import SubmitButton from '../components/SubmitButton.jsx'
import { useState } from 'react'
import * as React from 'react'
import { StyleSheet, Text } from "react-native"
import NewCategoryButton from "../components/NewCategoryButton.jsx"
import * as SecureStore from 'expo-secure-store';
import { BottomSheetView, BottomSheetTextInput, BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { FlatList } from "react-native-gesture-handler"
import CategoryEntryRenderer from "../components/CategoryEntryRenderer.jsx"
import EditCategoryButton from "../components/EditCategoryButton.jsx"

async function getCategories() {
    data = []
    let response = await SecureStore.getItemAsync('ecat0')
    let i = 1
    while (i <= response) {
        category = await SecureStore.getItemAsync('ecat' + i.toString())
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

const AddExpensePage = ({ bottomSheetRef }) => {
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [triggerDataReload, setTriggerDataReload] = useState(true)
    const [availableCategories, setAvailableCategories] = useState([])

    const clearSelections = () => {
        setAmount('')
        setCategory('')
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

    return (
        <BottomSheetView style={styles.container}>
            <Text style={styles.heading}>
                Add your Expense
            </Text>
            <BottomSheetTextInput
                style={styles.input}
                onChangeText={setAmount}
                value={amount.toString()}
                keyboardType={'numeric'}
                placeholder={'Amount'}
            />
            
            <NewCategoryButton redirectType={'expense'} onPress={() => {
                setTriggerDataReload(true)
            }} />

            <EditCategoryButton categories = {availableCategories} redirectType={'expense'} onPress={() => {
                setTriggerDataReload(true)
            }} />

            <FlatList
                data={availableCategories}
                renderItem={({ item }) => <CategoryEntryRenderer index={item.index} name={item.name} setCategory={setCategory} selectedCategory={category} />}
                keyExtractor={(item) => item.index}
                
            />


            <SubmitButton amount={amount} category={category} redirectType={'expense'} bottomSheetRef={bottomSheetRef} clearSelections={clearSelections} />
        </BottomSheetView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingTop: 10,
        justifyContent: 'center'
    },
    input: {
        marginTop: 12,
        marginBottom: 30,
        borderRadius: 10,
        fontSize: 16,
        lineHeight: 20,
        padding: 8,
        backgroundColor: 'rgba(151, 151, 151, 0.25)',
    },
    heading: {
        justifyContent: 'center',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    itemContainer: {
        padding: 6,
        margin: 6,
        backgroundColor: "#eee",
      }
})

export default AddExpensePage