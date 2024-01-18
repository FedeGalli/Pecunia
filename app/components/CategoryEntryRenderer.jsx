import { React, useEffect, useState } from "react"
import { View, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

const CategoryEntryRenderer = ({index, name, setCategory, selectedCategory}) => {

    const [isBold, setIsBold] = useState(false)

    useEffect( () => {
        if (selectedCategory !== name){
            setIsBold(false)
        }
    }, [selectedCategory])

    return(
        <View>
            <TouchableOpacity onPress={() => {
                setCategory(name)
                setIsBold(true)
            }}>
                <Text style={{fontSize: 20, fontWeight: isBold ? 'bold' : 'normal'}}>{name}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CategoryEntryRenderer