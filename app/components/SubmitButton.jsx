import { TouchableOpacity } from "react-native-gesture-handler"
import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native";
import * as SecureStore from 'expo-secure-store';

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

    
    //
}

const SubmitButton = ({amount, category, redirectType}) => {
    return(
        <View style={styles.content}>
            <TouchableOpacity style={styles.button} onPress={ async () => {
                await save(parseFloat(amount), category, redirectType)
                router.back()
            }}>
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    content:{
        alignContent:'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: 'red',
        borderRadius: 2, 
        padding: 50
    },
    icon: {
        margin: 14
    }
})

export default SubmitButton