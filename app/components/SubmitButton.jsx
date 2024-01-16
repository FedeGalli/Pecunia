import { TouchableOpacity } from "react-native-gesture-handler"
import { StyleSheet, Text, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { Keyboard } from "react-native";

async function save(amount, category, redirectType) {
    prefix = ''
    if (redirectType === 'expense') {
        prefix = 'e'
    } else if (redirectType === 'income') {
        prefix = 'i'
    }

    const result = await SecureStore.getItemAsync(prefix + '0');
    date = new Date()
    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (result) {
        let index = (parseInt(result, 10) + 1).toString()
        const value = JSON.stringify({index: (parseInt(result, 10) + 1), amount: amount, category: category, day: day, month: month, year: year})
        await SecureStore.setItemAsync(prefix + '0', index)
        await SecureStore.setItemAsync(prefix + index, value)


    } else {
 
        const value = JSON.stringify({index: 1, amount: amount, category: category, day: day, month: month, year: year})
        await SecureStore.setItemAsync(prefix + '0', '1')
        await SecureStore.setItemAsync(prefix + '1', value)
    }
}

const SubmitButton = ({amount, category, redirectType, bottomSheetRef, clearSelections}) => {
    return(
        <View>
            <TouchableOpacity style={styles.button} onPress={ async () => {
                if (amount !== '' && category !== ''){
                    Keyboard.dismiss()
                    await save(parseFloat(amount), category, redirectType)
                    clearSelections()
                    bottomSheetRef.current?.collapse()
                }
                else {
                    if (amount === '' && category === '')
                        alert(`Insert ${redirectType} amount and category !!!`)
                    else if (amount === '')
                        alert(`Insert ${redirectType} amount !!!`)
                    else
                        alert(`Insert ${redirectType} category !!!`)
                }
            }}>
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        fontSize: 16,
        lineHeight: 20,
        padding: 8,
        backgroundColor: 'grey',
        alignSelf: 'flex-end'
    },
    icon: {
        margin: 14
    }
})

export default SubmitButton