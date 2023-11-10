import { TouchableOpacity } from "react-native-gesture-handler"
import { Link, useRouter } from "expo-router"
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from "react-native";
import * as SecureStore from 'expo-secure-store';

async function save(value) {
    let key = await SecureStore.getItemAsync('len')
    console.log(key)
    if (key) {
        await SecureStore.setItemAsync('len', String.toString(parseInt(key, 10) + 1))
        await SecureStore.setItemAsync(key, value);
    }
    else {
        await SecureStore.setItemAsync('len', '0')
        await SecureStore.setItemAsync('0', value);
    }
}




const SubmitButton = ({amount, category}) => {
    const router = useRouter();
    return(
        <View style={styles.content}>
            <Link href={{pathname: `/(tabs)/[Expense]`, params: {amount: amount, category:category}}} style={styles.content} asChild>
                <TouchableOpacity style={styles.button} onPress={ () => {
                    save(JSON.stringify({amount, category}))
                    
                }}>
                    <Text>Submit</Text>
                </TouchableOpacity>
            </Link>
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