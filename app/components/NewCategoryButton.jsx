import { React } from "react"
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler"
import {AntDesign} from '@expo/vector-icons';
import { View } from "react-native-web";

const NewCategoryButton = ({redirectType, onPress}) => {
    href = ''
    if (redirectType === 'expense') {
        href = '/expense_list/NewCategoryExpensePage'
    } else if (redirectType === 'income') {
        href = '/income_list/NewCategoryIncomePage'
    }
    return(
        <Link href={href} asChild>
            <TouchableOpacity onPress={ () => {
                onPress()
            }}>
                <AntDesign name="plus" size={40} color="black" />
            </TouchableOpacity>
        </Link>
    )
}


export default NewCategoryButton