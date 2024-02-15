import { forwardRef, useState } from "react"
import { Stack, router } from "expo-router"
import { TextInput, StyleSheet, View, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import * as SecureStore from 'expo-secure-store';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetBackdrop
} from '@gorhom/bottom-sheet';


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
async function isDuplicate(categoryName:string, type:string) {
    categoryName = categoryName.toLowerCase()
    const len = parseInt(await SecureStore.getItemAsync(type + 'cat' + '0') || "");

    for (let i = 1; i <= len; i++){
        const entry = JSON.parse(await SecureStore.getItemAsync(type + 'cat' + i) || "").name.toString().toLowerCase()

        if (entry === categoryName){
            return true
        }
    }

    return false
}

const NewCategoryPage = ({ type, dismiss, dataReaload }: any) => {
    const [newCategory, setNewCategory] = useState('')
    return (
        <View>
            <TextInput
                style={styles.input}
                onChangeText={setNewCategory}
                value={newCategory}
                keyboardType={'default'}
                placeholder={type === 'e' ? 'Insert New Expense Catogory' : 'Insert New Income Category'}
            />
            <TouchableOpacity style={styles.button} onPress={async () => {
                if (newCategory !== '' && !(await isDuplicate(newCategory, type))) {
                    const result = await SecureStore.getItemAsync(type + 'cat' + '0');
                    const date = new Date()
                    const day = date.getDate()
                    const month = date.getMonth() + 1
                    const year = date.getFullYear()
                    const week = getWeekNumber(date)
    
                    if (result) {
                        let index = (parseInt(result, 10) + 1).toString()
                        const value = JSON.stringify({ index: (parseInt(result, 10) + 1), name: newCategory, type: type, day: day, week: week, month: month, year: year })
                        await SecureStore.setItemAsync(type + 'cat' + '0', index)
                        await SecureStore.setItemAsync(type + 'cat' + index, value)
                    }
                    else {
                        const value = JSON.stringify({ index: 1, name: newCategory, type: type, day: day, week: week, month: month, year: year })
                        await SecureStore.setItemAsync(type + 'cat' + '0', '1')
                        await SecureStore.setItemAsync(type + 'cat' + '1', value)
                    }
                    dataReaload(true)
                    dismiss()
                } else {
                    alert('Insert a valid name')
                }

            }}>
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        backgroundColor: '#fcba03',
        borderRadius: 2,
        padding: 20
    },
})

export default NewCategoryPage