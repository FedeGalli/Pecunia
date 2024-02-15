import { IntegerType } from "mongodb"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import * as SecureStore from 'expo-secure-store';
import { FontAwesome6 } from '@expo/vector-icons';

async function removeCategory(index: any, type: any) {

    const prefix = type === 'e' ? 'ecat' : 'icat'

    const maxLen = await SecureStore.getItemAsync(prefix + '0')

    if (maxLen !== null) {
        for (let i = index; i < maxLen; i++) {
            const item = JSON.parse(await SecureStore.getItemAsync(prefix + (i + 1).toString()) || "")
            if (item) {
                await SecureStore.deleteItemAsync(prefix + (i).toString())
                await SecureStore.setItemAsync(prefix + (i).toString(), JSON.stringify({ index: i, name: item.name, type: item.type, day: item.day, week: item.week, month: item.month, year: item.year }))
            }
        }
        await SecureStore.setItemAsync(prefix + '0', (parseInt(maxLen) - 1).toString())
        await SecureStore.deleteItemAsync(prefix + maxLen.toString())
    }
}

const CategoryEntryRenderer = ({ index, name, type, setCategory, setReload, selectedCategory }: any) => {

    const [isBold, setIsBold] = useState(false)

    useEffect(() => {
        if (selectedCategory !== name) {
            setIsBold(false)
        }
    }, [selectedCategory])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    setCategory(name)
                    setIsBold(true)
                }}
                onLongPress={() => {
                    //do something when pressed
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: isBold ? 'bold' : 'normal' }}>{name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={async () => {
                    removeCategory(index, type).then(() => {
                        setCategory('')
                        setReload(true)
                    })
                }}
                onLongPress={() => {
                    //do something when pressed
                }}
            >
                <FontAwesome6 name="trash-can" size={30} color="black" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row'
    }
});


export default CategoryEntryRenderer