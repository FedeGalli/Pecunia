import { IntegerType } from "mongodb"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import * as SecureStore from 'expo-secure-store';
import { FontAwesome6 } from '@expo/vector-icons';

async function removeCategory(index: any, type: any) {

    const prefix = type === 'e' ? 'ecat' : 'icat'

    const maxLen = await SecureStore.getItemAsync(prefix + '0')

    await SecureStore.deleteItemAsync(prefix + index.toString())

    if (maxLen === null) {
        return
    }
    if (index === maxLen) {
        for (let i = parseInt(maxLen) - 1; i >= 0; i--) {
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