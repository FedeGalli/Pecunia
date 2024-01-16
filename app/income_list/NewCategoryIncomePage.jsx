import { React, useState } from "react"
import { Stack, router } from "expo-router"
import { TextInput, StyleSheet, View, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import * as SecureStore from 'expo-secure-store';


const NewCategoryIncomePage = () => {
    const [newCategory, setNewCategory] = useState('')
    return (
        <View>
            <Stack.Screen options={{
                headerTitle: 'Add New Income Category'
            }} />
            <TextInput
                style={styles.input}
                onChangeText={setNewCategory}
                value={newCategory}
                keyboardType={'default'}
                placeholder={'Insert New Income Catogory'}
            />
            <TouchableOpacity style={styles.button} onPress={async () => {
                const result = await SecureStore.getItemAsync('icat' + '0');
                date = new Date()
                day = date.getDate()
                month = date.getMonth() + 1
                year = date.getFullYear()

                if (result) {
                    let index = (parseInt(result, 10) + 1).toString()
                    const value = JSON.stringify({index: (parseInt(result, 10) + 1), name: newCategory, day: day, month: month, year: year})
                    await SecureStore.setItemAsync('icat' + '0', index)
                    await SecureStore.setItemAsync('icat' + index, value)
                }
                else {
                    const value = JSON.stringify({index: 1, name: newCategory, day: day, month: month, year: year})
                    await SecureStore.setItemAsync('icat' + '0', '1')
                    await SecureStore.setItemAsync('icat' + '1', value)
                }
                
                router.back()
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
        backgroundColor: 'red',
        borderRadius: 2, 
        padding: 50
    },
})

export default NewCategoryIncomePage