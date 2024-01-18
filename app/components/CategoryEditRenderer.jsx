import { React } from "react"
import { View, Text, StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router'


async function removeCategory(index, redirectType) {

    const prefix = redirectType === 'expense' ? 'ecat' : 'icat'
    let maxLen = await SecureStore.getItemAsync(prefix + '0')
    maxLen = parseInt(maxLen)
    await SecureStore.deleteItemAsync(prefix + index.toString())

    if (index === maxLen) {
        for (i = maxLen - 1; i >= 0; i--) {
            if (i === 0) {
                await SecureStore.deleteItemAsync(prefix + '0')
            }

            const item = await SecureStore.getItemAsync(prefix + i.toString())
            if (item) {
                await SecureStore.setItemAsync(prefix + '0', i.toString())
                break
            }
        }
    }
}

const CategoryEditRenderer = ({ index, name, redirectType }) => {

    return (
        <View style={styles.input}>
            <TouchableOpacity style={{ }} onPress={{ //Margin is not correct, is not adapting to the category name text length (search other params)
                //implement edit name page
            }}>
                <AntDesign name="edit" size={30} color="black" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: 20 }} onPress={async () => {
                await removeCategory(index, redirectType)
                router.back()
            }}>
                <MaterialCommunityIcons name="delete-empty" size={30} color="black" style={styles.icon} />
            </TouchableOpacity>
            <Text style={{}}>{index} {name}</Text>

        </View>
    )
}


const styles = StyleSheet.create({
    input: {
        height: 50,
        margin: 8,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        flexDirection: 'row-reverse',
        flex: 1
    },
    textCotainer: {
        
    }
})

export default CategoryEditRenderer