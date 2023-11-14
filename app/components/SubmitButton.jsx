import { TouchableOpacity } from "react-native-gesture-handler"
import { Link, router } from "expo-router"
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from "react-native";
import * as SecureStore from 'expo-secure-store';

async function save(amount, category) {
    
    let result = await SecureStore.getItemAsync('0');
    if (result) {
        let index = (parseInt(result, 10) + 1).toString()
        const value = JSON.stringify({index: (parseInt(result, 10) + 1), amount: amount, category: category})
        await SecureStore.setItemAsync('0', index)
        await SecureStore.setItemAsync(index, value)


    } else {
        const value = JSON.stringify({index: 1, amount: amount, category: category})
        await SecureStore.setItemAsync('0', '1')
        await SecureStore.setItemAsync('1', value)
    }

    
    //
}

const SubmitButton = ({amount, category}) => {
    return(
        <View style={styles.content}>
            <TouchableOpacity style={styles.button} onPress={ async () => {
                await save(parseFloat(amount), category)
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