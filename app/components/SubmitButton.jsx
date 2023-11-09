import { TouchableOpacity } from "react-native-gesture-handler"
import { Link, useRouter } from "expo-router"
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from "react-native";

const SubmitButton = ({amount, category}) => {
    const router = useRouter();
    return(
        <View style={styles.content}>
            <Link href={`/(tabs)/Expense/${amount}`} style={styles.content} asChild>
                <TouchableOpacity style={styles.button} onPress={() => {
                    console.log('passed')
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