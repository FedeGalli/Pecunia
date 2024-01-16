import { React } from "react"
import { router } from "expo-router";
import { View} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import {AntDesign} from '@expo/vector-icons';

const EditCategoryButton = ({redirectType, onPress, categories}) => {
    href = ''
    if (redirectType === 'expense') {
        href = '/expense_list/EditCategoryExpensePage'
    } else if (redirectType === 'income') {
        href = '/income_list/EditCategoryIncomePage'
    }
    return(
        <View>
            <TouchableOpacity onPress={ () => {
                onPress()
                router.push({ pathname: href, params: {cat: JSON.stringify(categories)}})
            }}>
                <AntDesign name="edit" size={40} color="black" />
            </TouchableOpacity>
        </View>
    )
}


export default EditCategoryButton